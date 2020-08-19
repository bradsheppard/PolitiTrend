import json

import dask.dataframe as dd
from dask_kubernetes import KubeCluster
from dask.distributed import Client
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from state_party_affiliation_analytic.common.path_translator import get_s3_path
from state_party_affiliation_analytic.config import config
from state_party_affiliation_analytic.dask.dataframe import compute_party_sentiments
from state_party_affiliation_analytic.message_bus import MessageBus
from state_party_affiliation_analytic.model.politician import PoliticianRepository
from state_party_affiliation_analytic.model.state_party_affiliation import StatePartyAffiliation, Affiliations


def enqueue_state_party_affiliation(dd):
    state_party_affiliation = StatePartyAffiliation(dd.Index, Affiliations(dd.Republican, dd.Democratic))
    serialized = json.dumps(state_party_affiliation.__dict__, default=lambda o: o.__dict__)
    message_queue.send(str.encode(serialized))

    return None


if __name__ == "__main__":

    kube_cluster = KubeCluster.from_yaml('worker-spec.yml')
    kube_cluster.scale(int(config.analytic_num_workers))

    with Client(kube_cluster) as client:

        sentiment_analyzer = SentimentIntensityAnalyzer()
        message_queue = MessageBus(config.queue_host, config.queue_topic)

        paths = [get_s3_path(i) for i in range(int(config.analytic_lookback_days))]

        politician_repository = PoliticianRepository()
        politicians = politician_repository.get_all()

        storage_options = {
            "key": config.s3_username,
            "secret": config.s3_password,
            "client_kwargs": {
                "endpoint_url": config.s3_url
            }
        }

        dfs = []

        for path in paths:
            try:
                df = dd.read_json(path, storage_options=storage_options)
                dfs.append(df)
            except Exception:
                print('Error reading path ' + path)

        combined_df = dd.concat(dfs)

        result = compute_party_sentiments(combined_df, politicians)

        for row in result.itertuples():
            enqueue_state_party_affiliation(row)

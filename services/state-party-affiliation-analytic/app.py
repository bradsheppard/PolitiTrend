import json

import dask.dataframe as dd
from dask.distributed import Client
from dask_kubernetes import KubeCluster

from state_party_affiliation_analytic.path_translator import get_s3_path
from state_party_affiliation_analytic.config import config
from state_party_affiliation_analytic.dataframe import compute_party_sentiments
from state_party_affiliation_analytic.message_bus import MessageBus
from state_party_affiliation_analytic.politician import PoliticianRepository
from state_party_affiliation_analytic.state_party_affiliation import StatePartyAffiliation, from_dataframe


def enqueue_state_party_affiliation(state_party_affiliation: StatePartyAffiliation):
    serialized = json.dumps(state_party_affiliation.__dict__, default=lambda o: o.__dict__)
    message_queue.send(str.encode(serialized))


if __name__ == "__main__":
    num_workers = int(config.analytic_num_workers)

    kube_cluster = KubeCluster.from_yaml('worker-spec.yml')
    kube_cluster.scale(num_workers)

    message_queue = MessageBus(config.queue_host, config.queue_topic)

    politician_repository = PoliticianRepository()
    politicians = politician_repository.get_all()

    paths = [get_s3_path(i) for i in range(int(config.analytic_lookback_days))]

    with Client(kube_cluster) as client:
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

        state_party_affiliations = from_dataframe(result)

        for state_party_affiliation in state_party_affiliations:
            enqueue_state_party_affiliation(state_party_affiliation)

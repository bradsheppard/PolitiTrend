import json
import dask.dataframe as dd

from dask.dataframe import DataFrame
from dask.distributed import Client
from dask_kubernetes import KubeCluster

from state_party_affiliation_analytic.config import config
from state_party_affiliation_analytic.dataframe import compute_party_sentiments, to_result_dataframe
from state_party_affiliation_analytic.message_bus import MessageBus
from state_party_affiliation_analytic.politician import get_all
from state_party_affiliation_analytic.state_party_affiliation \
    import StatePartyAffiliation, from_dataframe
from state_party_affiliation_analytic.tweet_repository import TweetRepository


def enqueue_state_party_affiliation(affiliation: StatePartyAffiliation):
    serialized = json.dumps(affiliation.__dict__, default=lambda o: o.__dict__)
    message_queue.send(str.encode(serialized))


if __name__ == "__main__":
    num_workers = int(config.analytic_num_workers)

    kube_cluster = KubeCluster.from_yaml('worker-spec.yml')
    kube_cluster.scale(num_workers)

    tweet_repository = TweetRepository()

    message_queue = MessageBus(config.queue_host, config.queue_topic)

    politicians = get_all()

    client = Client(kube_cluster)

    tweet_repository.delete_analyzed_tweets('temp')
    tweets_df: DataFrame = tweet_repository.read_tweets()
    tweets_df = tweets_df.set_index('tweetId')
    tweets_df = tweets_df.repartition(npartitions=config.analytic_num_partitions)
    tweets_df = tweets_df.persist()

    analyzed_tweets_df = tweet_repository.read_analyzed_tweets('analyzed-tweets')
    analyzed_tweets_df.set_index('tweetId')
    analyzed_tweets_df = analyzed_tweets_df \
        .repartition(npartitions=config.analytic_num_partitions)
    analyzed_tweets_df = analyzed_tweets_df.persist()

    combined_df = tweets_df \
        .merge(analyzed_tweets_df[['tweetId', 'state', 'democratic', 'republican']],
               how='left', on='tweetId', indicator=True)
    combined_df = combined_df.drop_duplicates(subset=['tweetId'])
    tweets_to_analyze = combined_df[combined_df['_merge'] == 'left_only']\
        .repartition(npartitions=config.analytic_num_partitions)\

    sentiment_results = compute_party_sentiments(tweets_to_analyze, politicians)\
        .persist()

    tweets_already_analyzed = combined_df[combined_df['_merge'] == 'both']

    result = dd.concat([sentiment_results, tweets_already_analyzed])
    result = result.repartition(npartitions=config.analytic_num_partitions)

    del result['_merge']

    tweet_repository.write_analyzed_tweets(result, 'temp')

    result = to_result_dataframe(result)

    state_party_affiliations = from_dataframe(result)

    for state_party_affiliation in state_party_affiliations:
        enqueue_state_party_affiliation(state_party_affiliation)

    tweet_repository.delete_analyzed_tweets('analyzed-tweets')
    analyzed_tweets_df = tweet_repository.read_analyzed_tweets('temp')
    tweet_repository.write_analyzed_tweets(analyzed_tweets_df, 'analyzed-tweets')

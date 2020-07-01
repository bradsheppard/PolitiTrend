from typing import List

from state_party_affiliation_analytic.model.politician import Politician
from state_party_affiliation_analytic.sentiment_analyzer import get_party_sentiments
from state_party_affiliation_analytic.state import get_state


def compute_party_sentiments(df, politicians: List[Politician]):
    df['sentiment'] = df['tweetText'].map(lambda x: get_party_sentiments(x, politicians))
    df['state'] = df['location'].map(get_state)
    df = df.assign(
        Democratic=df['sentiment'].map(lambda x: x['Democratic'] if 'Democratic' in x else 0),
        Republican=df['sentiment'].map(lambda x: x['Republican'] if 'Republican' in x else 0)
    )

    df = df.groupby(['state'])[['Democratic', 'Republican']].mean()

    return df

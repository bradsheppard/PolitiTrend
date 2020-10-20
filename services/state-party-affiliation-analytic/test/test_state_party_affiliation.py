import pandas as pd

from state_party_affiliation_analytic.state_party_affiliation import StatePartyAffiliation, from_dataframe, Affiliations


def test_from_dataframe():
    arrays = [['Democratic', 'Democratic', 'Republican', 'Republican'], ['count', 'mean', 'count', 'mean']]
    tuples = list(zip(*arrays))

    index = pd.MultiIndex.from_tuples(tuples)

    pandas_df = pd.DataFrame([[1, 0, 1, 0.6588], [1, 0.6588, 1, 0]], columns=index, index=['KY', 'NY'])

    print(pandas_df.head())

    state_party_affiliations = from_dataframe(pandas_df)

    expected_state_party_affiliations = [
        StatePartyAffiliation('KY', Affiliations(0.6588, 0), 1),
        StatePartyAffiliation('NY', Affiliations(0, 0.6588), 1)
    ]

    assert expected_state_party_affiliations == state_party_affiliations
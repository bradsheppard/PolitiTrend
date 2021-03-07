import pandas as pd

from state_party_affiliation_analytic.state_party_affiliation \
    import StatePartyAffiliation, from_dataframe, Affiliations


def test_from_dataframe():
    pandas_df = pd.DataFrame([[1, 0, 2], [1, 0.6588, 3]],
                             columns=['democratic', 'republican', 'count'], index=['KY', 'NY'])

    state_party_affiliations = from_dataframe(pandas_df)

    expected_state_party_affiliations = [
        StatePartyAffiliation('KY', Affiliations(0, 1), 2),
        StatePartyAffiliation('NY', Affiliations(0.6588, 1), 3)
    ]

    assert expected_state_party_affiliations == state_party_affiliations

from typing import List

import pandas as pd
from dataclasses import dataclass


@dataclass
class Affiliations:
    republican: float
    democratic: float


# pylint: disable=invalid-name
@dataclass
class StatePartyAffiliation:
    state: str
    affiliations: Affiliations
    sampleSize: int


def from_dataframe(df: pd.DataFrame) -> List[StatePartyAffiliation]:
    state_party_affiliations = []

    for index, row in df.iterrows():
        state_party_affiliation = StatePartyAffiliation(
            index,
            Affiliations(
                row['republican'], row['democratic']),
            row['count']
        )

        state_party_affiliations.append(state_party_affiliation)

    return state_party_affiliations

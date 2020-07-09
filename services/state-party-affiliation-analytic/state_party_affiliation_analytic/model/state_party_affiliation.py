from dataclasses import dataclass


@dataclass
class Affiliations:
    republican: int
    democratic: int


@dataclass
class StatePartyAffiliation:
    state: str
    affiliations: Affiliations

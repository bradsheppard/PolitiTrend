from dataclasses import dataclass


@dataclass
class Sentiment:
    politician: int
    value: float

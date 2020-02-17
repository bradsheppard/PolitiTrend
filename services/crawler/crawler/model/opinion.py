from typing import List
from dataclasses import dataclass


@dataclass
class Sentiment:
    politician: int
    value: float


@dataclass
class Opinion:
    sentiments: List[Sentiment]
    dateTime: str

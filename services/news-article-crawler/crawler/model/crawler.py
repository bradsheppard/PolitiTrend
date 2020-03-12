from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List

T = TypeVar('T')


class Crawler(Generic[T], ABC):

    @abstractmethod
    def get(self, search_term: str) -> List[T]:
        pass

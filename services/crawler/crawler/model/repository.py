from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List

T = TypeVar('T')


class Repository(Generic[T], ABC):

    @abstractmethod
    def insert(self, entity: T):
        pass

    @abstractmethod
    def get_all(self) -> List[T]:
        pass

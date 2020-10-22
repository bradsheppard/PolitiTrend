import datetime

from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

Base = declarative_base()


class Job(Base):
    # pylint: disable=too-few-public-methods
    __tablename__ = 'Job'

    id = Column(Integer, primary_key=True)
    politician = Column(Integer)
    timestamp = Column(DateTime, default=datetime.datetime.now)


class JobRepository:

    def __init__(self, session: Session):
        self._session = session

    def insert(self, job: Job):
        self._session.add(job)
        self._session.commit()

    def get(self, job_id: int) -> Job:
        job = self._session.query(Job).filter_by(id=job_id).first()
        return job

    def get_latest(self) -> Job:
        job = self._session.query(Job).order_by(Job.id.desc()).first()
        return job

    def delete_all(self):
        self._session.query(Job).delete()
        self._session.commit()

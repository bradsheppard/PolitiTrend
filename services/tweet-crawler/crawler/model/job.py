import datetime

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

Base = declarative_base()


class Job(Base):

    __tablename__ = 'Job'

    id = Column(Integer, primary_key=True)
    minTweetId = Column(String)
    maxTweetId = Column(String)
    politician = Column(Integer)
    timestamp = Column(DateTime, default=datetime.datetime.now)


class JobRepository:

    def __init__(self, session: Session):
        self._session = session

    def insert(self, job: Job):
        self._session.add(job)
        self._session.commit()

    def get(self, job_id: int):
        job = self._session.query(Job).filter_by(id=job_id).first()
        return job

    def get_latest_for_politician(self, politician_id: int):
        job = self._session.query(Job).filter_by(politician=politician_id).order_by(Job.id.desc()).first()
        return job

    def delete_all(self):
        self._session.query(Job).delete()
        self._session.commit()

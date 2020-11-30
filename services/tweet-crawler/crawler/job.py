import datetime
from typing import List, Dict

from functional import seq
from sqlalchemy import Column, Integer, String, DateTime, func, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

from crawler.politician import Politician

Base = declarative_base()


class Job(Base):
    # pylint: disable=too-few-public-methods
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

    def get(self, job_id: int) -> Job:
        job = self._session.query(Job).filter_by(id=job_id).first()
        return job

    def get_latest_per_politician(self) -> List[Job]:
        subq = self._session.query(
            Job.politician,
            func.max(Job.timestamp).label('maxdate')
        ).group_by(Job.politician).subquery('t2')

        query = self._session.query(Job).join(subq, and_(
            Job.politician == subq.c.politician,
            Job.timestamp == subq.c.maxdate
        ))
        return query.all()

    def get_latest_time_for_politicians(self, politicians: List[Politician]) \
            -> Dict[Politician, datetime.datetime]:
        result = {}
        jobs = self.get_latest_per_politician()

        for politician in politicians:
            matching_job = seq(jobs).find(lambda x, p=politician: x.politician == p.num)
            if matching_job is not None:
                result[politician] = matching_job.timestamp
            else:
                result[politician] = datetime.datetime(1, 1, 1, 0, 0)

        return result

    def get_latest_for_politician(self, politician_id: int) -> Job:
        job = self._session.query(Job).filter_by(politician=politician_id) \
            .order_by(Job.id.desc()).first()
        return job

    def delete_all(self):
        self._session.query(Job).delete()
        self._session.commit()

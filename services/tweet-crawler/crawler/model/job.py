from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class Job(Base):
    id = Column(Integer, primary_key=True)
    minTweetId = Column(String)
    maxTweetId = Column(String)


class JobRepository:

    def __init__(self, username, password):
        self._engine = create_engine('', echo=True)

    def insert(self, job: Job):
        session = sessionmaker(bind=self._engine)
        session.add(job)

    def get(self, job_id: int):
        session = sessionmaker(bind=self._engine)
        job = session.query(Job).filter_by(id=job_id).first()
        return job


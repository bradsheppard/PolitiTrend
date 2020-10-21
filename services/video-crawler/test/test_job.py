# pylint: disable=redefined-outer-name

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from crawler.config import config
from crawler.job import JobRepository, Job


@pytest.fixture
def job_repository():
    engine = create_engine(config.sql_connection_string, echo=True)
    session_maker = sessionmaker(bind=engine)
    session = session_maker()
    job_repository = JobRepository(session)
    return job_repository


def test_insert_and_get(job_repository: JobRepository):
    expected_job = Job()
    job_repository.insert(expected_job)

    actual_job = job_repository.get(expected_job.id)
    assert expected_job == actual_job


def test_delete_all(job_repository: JobRepository):
    job1 = Job(politician=1)
    job2 = Job(politician=1)

    job_repository.insert(job1)
    job_repository.insert(job2)

    job_repository.delete_all()

    job = job_repository.get_latest()

    assert job is None


def test_get_latest(job_repository: JobRepository):
    job1 = Job(politician=1)
    job2 = Job(politician=2)

    job_repository.insert(job1)
    job_repository.insert(job2)

    job = job_repository.get_latest()
    assert job2 == job

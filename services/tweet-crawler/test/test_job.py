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
    expected_job = Job(minTweetId='11', maxTweetId='20')
    job_repository.insert(expected_job)

    actual_job = job_repository.get(expected_job.id)
    assert_job(expected_job, actual_job)


def test_delete_all(job_repository: JobRepository):
    job1 = Job(minTweetId='11', maxTweetId='22', politician=1)
    job2 = Job(minTweetId='33', maxTweetId='44', politician=1)

    job_repository.insert(job1)
    job_repository.insert(job2)

    job_repository.delete_all()

    job = job_repository.get_latest_for_politician(1)

    assert job is None


def test_get_latest_same_politician(job_repository: JobRepository):
    job1 = Job(minTweetId='11', maxTweetId='22', politician=1)
    job2 = Job(minTweetId='33', maxTweetId='44', politician=1)

    job_repository.insert(job1)
    job_repository.insert(job2)

    job = job_repository.get_latest_for_politician(1)
    assert_job(job2, job)


def test_get_latest_different_politicians(job_repository: JobRepository):
    job1 = Job(minTweetId='11', maxTweetId='22', politician=1)
    job2 = Job(minTweetId='33', maxTweetId='44', politician=2)

    job_repository.insert(job1)
    job_repository.insert(job2)

    job = job_repository.get_latest_for_politician(1)
    assert_job(job1, job)


def assert_job(expected: Job, actual: Job):
    assert expected.id == actual.id
    assert expected.minTweetId == actual.minTweetId
    assert expected.maxTweetId == actual.maxTweetId

import pytest
from crawler.config import config
from crawler.model.job import JobRepository, Job


@pytest.fixture
def job_repository():
    job_repository = JobRepository(config.sql_username, config.sql_password)
    return job_repository


def test_insert_and_get(job_repository: JobRepository):
    expected_job = Job(1, '11', '20')
    job_repository.insert(expected_job)

    actual_job = job_repository.get(expected_job.id)
    assert expected_job == actual_job

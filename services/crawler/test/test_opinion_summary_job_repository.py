import time

from crawler.model import OpinionSummaryRepository
from crawler.model import OpinionSummaryJob, OpinionSummaryJobRepository


def test_insert_and_get():
    repository = OpinionSummaryJobRepository()

    job = OpinionSummaryJob()
    job.politician = 1

    inserted_job = repository.insert(job)

    retrieved_job = repository.get(inserted_job.id)

    assert retrieved_job.politician == job.politician


def test_insert_and_summary_generated():
    job_repository = OpinionSummaryJobRepository()
    summary_repository = OpinionSummaryRepository()

    job = OpinionSummaryJob()
    job.politician = 1

    inserted_job = job_repository.insert(job)

    time.sleep(4)

    retrieved_job = job_repository.get(inserted_job.id)

    summary = summary_repository.get(retrieved_job.opinionSummary)

    assert summary.sentiment > 0
    assert summary.politician == 1

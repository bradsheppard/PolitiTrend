from typing import List
import requests
from attr import dataclass


@dataclass(init=False)
class OpinionSummaryJob:
    id: int
    politician: int
    opinionSummary: int


class OpinionSummaryJobRepository:

    def __init__(self):
        self._host = 'http://opinion/job/opinionsummary'

    def insert(self, opinion_summary_job: OpinionSummaryJob):
        res = requests.post(self._host, json=vars(opinion_summary_job))
        response_json = res.json()

        job = OpinionSummaryJob()
        job.id = response_json['id']
        job.politician = response_json['politician']
        job.opinionSummary = response_json['opinionSummary']
        return job

    def get(self, num: int) -> OpinionSummaryJob:
        res = requests.get(self._host + '/' + str(num))
        response_json = res.json()

        job = OpinionSummaryJob()
        job.id = response_json['id']
        job.politician = response_json['politician']
        job.opinionSummary = response_json['opinionSummary']
        return job

    def get_all(self) -> List[OpinionSummaryJob]:
        res = requests.get(self._host)
        response_json = res.json()

        jobs = []

        for entry in response_json:
            job = OpinionSummaryJob()
            job.id = entry['id']
            job.politician = entry['politician']
            job.opinionSummary = entry['opinionSummary']

            jobs.append(job)

        return jobs

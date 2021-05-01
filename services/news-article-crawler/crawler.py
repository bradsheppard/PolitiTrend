import sys
import timeit
from typing import List
from dependency_injector.wiring import inject, Provide

from crawler.container import Container
from crawler.job import JobRepository, Job
from crawler.news_article import NewsArticleCrawler, NewsArticleRepository
from crawler.politician import get_all, Politician


@inject
def main(
        news_article_repository: NewsArticleRepository = Provide[Container.news_article_repository],
        news_article_crawler: NewsArticleCrawler = Provide[Container.news_article_crawler],
        job_repository: JobRepository = Provide[Container.job_repository]
) -> None:
    politicians: List[Politician] = get_all()

    latest_jobs = job_repository.get_latest_time_for_politicians(politicians)
    sorted_jobs = sorted(latest_jobs.items(), key=lambda x: x[1])

    start = timeit.default_timer()

    for politician, job in sorted_jobs:
        print('Crawling for ' + politician.name)
        try:
            results = news_article_crawler.get(politician, politicians)
            for result in results:
                news_article_repository.insert(result)
            job_repository.insert(Job(politician=politician.id))
        except Exception as ex:
            print('Error occurred while crawling ' + politician.name)
            print(ex)

    end = timeit.default_timer()
    print('Total time: ', end - start)


if __name__ == '__main__':
    container = Container()
    container.wire(modules=[sys.modules[__name__]])

    main()

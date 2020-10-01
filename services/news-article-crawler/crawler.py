import timeit
from typing import List

from crawler.container import Container
from crawler.politician import Politician

container = Container()

politician_repository = container.politician_repository()
news_article_repository = container.news_article_repository()
news_article_crawler = container.news_article_crawler()

politicians: List[Politician] = politician_repository.get_all()

start = timeit.default_timer()

for politician in politicians:
    print('Crawling for ' + politician.name)
    try:
        results = news_article_crawler.get(politician, politicians)
        for result in results:
            news_article_repository.insert(result)
    except Exception as ex:
        print('Error occurred while crawling ' + politician.name)
        print(ex)

end = timeit.default_timer()

print('Total time: ', end - start)

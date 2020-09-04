import datetime
import random
import string
import time
from unittest.mock import patch, MagicMock

import pytest
from dateutil import parser

from crawler.config import config
from crawler.container import Container
from crawler.model.news_article import NewsArticleCrawler, NewsArticle
from crawler.model.politician import Politician


@pytest.fixture
@patch('crawler.summarizer.Summarizer')
def news_article_crawler(summarizer_mock):
    summarize_mock = MagicMock(return_value='summary')
    summarizer_mock.summarize = summarize_mock

    news_article_crawler = NewsArticleCrawler(config.contextual_web_api_key, summarizer_mock)
    return news_article_crawler


@pytest.fixture
def news_article_repository():
    container = Container()
    news_article_repository = container.news_article_repository()

    return news_article_repository


def test_get(news_article_crawler: NewsArticleCrawler):
    test_politician: Politician = Politician(1, 'Donald Trump')

    news_articles = news_article_crawler.get(test_politician, [])
    assert len(news_articles) == 0


def test_get_with_politicians(news_article_crawler):
    test_politician: Politician = Politician(1, 'Donald Trump')

    news_articles = news_article_crawler.get(test_politician, [test_politician])
    assert len(news_articles) > 0

    for news_article in news_articles:
        assert news_article.politicians == [1]


def test_insert_and_get(news_article_repository):
    news_article = NewsArticle(
        image=random_string(),
        title=random_string(),
        url=random_string(),
        dateTime=datetime.datetime.now().isoformat(' ', 'seconds'),
        politicians=[1],
        source=random_string(),
        description=random_string(),
        summary=random_string()
    )

    news_article_repository.insert(news_article)

    time.sleep(2)
    inserted_news_articles = news_article_repository.get_all()

    assert len(inserted_news_articles) > 0

    match = False

    for inserted_news_article in inserted_news_articles:
        if (
                inserted_news_article.title == news_article.title and
                inserted_news_article.politicians[0] == news_article.politicians[0] and
                parser.parse(inserted_news_article.dateTime).replace(tzinfo=None).isoformat(' ', 'seconds') ==
                parser.parse(news_article.dateTime).replace(tzinfo=None).isoformat(' ', 'seconds')
        ):
            match = True

    assert match


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(string_length))

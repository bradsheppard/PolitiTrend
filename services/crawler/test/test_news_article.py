import datetime
import random
import string
import time

import pytest
from dateutil import parser

from crawler.config import config
from crawler.model.news_article import NewsArticleCrawler, NewsArticleRepository, NewsArticle, Sentiment


@pytest.fixture
def news_article_crawler():
    news_article_crawler = NewsArticleCrawler(config.contextual_web_api_key)
    return news_article_crawler


def test_get(news_article_crawler):
    news_articles = news_article_crawler.get('Donald Trump')
    assert len(news_articles) > 0


def test_insert_and_get():
    repository = NewsArticleRepository()

    sentiment = Sentiment(
        politician=1,
        value=1
    )

    news_article = NewsArticle(
        image=random_string(),
        title=random_string(),
        url=random_string(),
        dateTime=datetime.datetime.now().isoformat(' ', 'seconds'),
        sentiments=[sentiment]
    )

    repository.insert(news_article)

    time.sleep(2)
    inserted_news_articles = repository.get_all()

    assert len(inserted_news_articles) > 0

    match = False

    for inserted_news_article in inserted_news_articles:
        if (
                inserted_news_article.title == news_article.title and
                inserted_news_article.sentiments[0]['value'] == news_article.sentiments[0].value and
                inserted_news_article.sentiments[0]['politician'] == news_article.sentiments[0].politician and
                parser.parse(inserted_news_article.dateTime).replace(tzinfo=None).isoformat(' ', 'seconds') ==
                parser.parse(news_article.dateTime).replace(tzinfo=None).isoformat(' ', 'seconds')
        ):
            match = True

    assert match


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))

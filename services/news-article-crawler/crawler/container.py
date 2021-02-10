from dependency_injector import containers, providers
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from crawler.config import config
from crawler.job import JobRepository
from crawler.message_bus import MessageBus
from crawler.news_article import NewsArticleRepository, NewsArticleCrawler
from crawler.politician import PoliticianRepository
from crawler.summarizer import Summarizer


class Container(containers.DeclarativeContainer):

    container_config = providers.Configuration()

    engine = providers.Singleton(
        create_engine,
        config.sql_connection_string
    )

    session_maker = providers.Singleton(
        sessionmaker,
        bind=engine
    )

    job_repository = providers.Singleton(
        JobRepository,
        session_maker=session_maker
    )

    message_bus = providers.Singleton(
        MessageBus,
        host=config.kafka_host,
        topic=config.kafka_topic
    )

    news_article_repository = providers.Singleton(
        NewsArticleRepository,
        message_bus=message_bus
    )

    summarizer = providers.Singleton(
        Summarizer
    )

    news_article_crawler = providers.Singleton(
        NewsArticleCrawler,
        api_key=config.contextual_web_api_key,
        summarizer=summarizer
    )

    politician_repository = providers.Singleton(
        PoliticianRepository
    )

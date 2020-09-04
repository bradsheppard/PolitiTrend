from dependency_injector import containers, providers
from crawler.config import config
from crawler.message_bus import MessageBus
from crawler.model.news_article import NewsArticleRepository, NewsArticleCrawler
from crawler.model.politician import PoliticianRepository
from crawler.summarizer import Summarizer


class Container(containers.DeclarativeContainer):

    container_config = providers.Configuration()

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

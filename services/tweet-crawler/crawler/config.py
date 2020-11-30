import configparser
from dataclasses import dataclass

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')

twitter_config = config_parser['twitter']
sql_config = config_parser['sql']
crawler_config = config_parser['crawler']


@dataclass
class Config:
    # pylint: disable=too-many-instance-attributes
    twitter_consumer_key: str
    twitter_consumer_secret: str
    sql_connection_string: str
    crawler_size: int


config = Config(
    twitter_config['consumer_key'],
    twitter_config['consumer_secret'],
    sql_config['connection_string'],
    int(crawler_config['size'])
)

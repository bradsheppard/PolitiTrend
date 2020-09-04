import configparser
from dataclasses import dataclass

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')

contextual_web_config = config_parser['contextual_web']
kafka_config = config_parser['kafka']


@dataclass
class Config:
    contextual_web_api_key: str
    kafka_host: str
    kafka_topic: str


config = Config(
    contextual_web_config['api_key'],
    kafka_config['host'],
    kafka_config['topic']
)

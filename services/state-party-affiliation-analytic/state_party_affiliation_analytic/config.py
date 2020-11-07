import configparser
from dataclasses import dataclass

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')

s3_config = config_parser['s3']
analytic_config = config_parser['analytic']
queue_config = config_parser['queue']


@dataclass()
class Config:
    s3_username: str
    s3_password: str
    s3_url: str
    analytic_lookback_days: int
    analytic_num_workers: int
    analytic_num_partitions: int
    queue_host: str
    queue_topic: str


config = Config(
    s3_username=s3_config['username'],
    s3_password=s3_config['password'],
    s3_url=s3_config['url'],
    analytic_lookback_days=int(analytic_config['lookback_days']),
    analytic_num_workers=int(analytic_config['num_workers']),
    analytic_num_partitions=int(analytic_config['num_partitions']),
    queue_host=queue_config['url'],
    queue_topic=queue_config['topic']
)

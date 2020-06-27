import configparser
from dataclasses import dataclass

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')
s3_config = config_parser['s3']


@dataclass()
class Config:
    s3_username: str
    s3_password: str
    s3_url: str


config = Config(
    s3_username=s3_config['username'],
    s3_password=s3_config['password'],
    s3_url=s3_config['url']
)

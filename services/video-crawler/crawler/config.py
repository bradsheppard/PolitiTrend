import configparser

from attr import dataclass

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')

youtube_config = config_parser['youtube_api']
sql_config = config_parser['sql']
crawler_config = config_parser['crawler']


@dataclass
class Config:
    # pylint: disable=too-many-instance-attributes
    youtube_api_key: str
    sql_connection_string: str
    crawler_size: int


config = Config(
    youtube_api_key=youtube_config['api_key'],
    sql_connection_string=sql_config['connection_string'],
    crawler_size=int(crawler_config['size'])
)

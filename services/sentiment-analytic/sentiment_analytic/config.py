import configparser
from dataclasses import dataclass

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')
s3_config = config_parser['s3a']
analytic_config = config_parser['analytic']
kafka_config = config_parser['kafka']


@dataclass
class Config:
    # pylint: disable=too-many-instance-attributes
    s3a_access_key: str
    s3a_secret_key: str
    s3a_path_style_access: str
    s3a_impl: str
    s3a_endpoint: str
    s3a_ssl_enabled: str
    analytic_lookback_days: int
    kafka_bootstrap_server: str
    kafka_topic:str


config = Config(
    s3_config['fs.s3a.access.key'],
    s3_config['fs.s3a.secret.key'],
    s3_config['fs.s3a.path.style.access'],
    s3_config['fs.s3a.impl'],
    s3_config['fs.s3a.endpoint'],
    s3_config['fs.s3a.connection.ssl.enabled'],
    int(analytic_config['lookback_days']),
    kafka_config['bootstrap_server'],
    kafka_config['topic']
)

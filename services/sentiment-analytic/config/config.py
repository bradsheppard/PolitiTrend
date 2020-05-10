import configparser
from dataclasses import dataclass

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')
s3_config = config_parser['s3a']


@dataclass
class Config:
    s3a_access_key: str
    s3a_secret_key: str
    s3a_path_style_access: str
    s3a_impl: str
    s3a_endpoint: str
    s3a_ssl_enabled: str


config = Config(
    s3_config['fs.s3a.access.key'],
    s3_config['fs.s3a.secret.key'],
    s3_config['fs.s3a.path.style.access'],
    s3_config['fs.s3a.impl'],
    s3_config['fs.s3a.endpoint'],
    s3_config['fs.s3a.connection.ssl.enabled']
)

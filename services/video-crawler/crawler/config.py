import configparser

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')

youtube_config = config_parser['youtube_api']
sql_config = config_parser['sql']


class Config:

    def __init__(self):
        self.api_key = None
        self.sql_connection_string = None

    @property
    def api_key(self):
        return self._api_key

    @api_key.setter
    def api_key(self, value):
        self._api_key = value

    @property
    def sql_connection_string(self):
        return self._sql_connection_string

    @sql_connection_string.setter
    def sql_connection_string(self, value):
        self._sql_connection_string = value


config = Config()

config.api_key = youtube_config['api_key']
config.sql_connection_string = sql_config['connection_string']

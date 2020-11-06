import configparser

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')

twitter_config = config_parser['twitter']
sql_config = config_parser['sql']


class Config:
    # pylint: disable=too-many-instance-attributes

    def __init__(self):
        self.twitter_consumer_key = None
        self.twitter_consumer_secret = None
        self.twitter_access_token = None
        self.twitter_access_token_secret = None
        self.sql_connection_string = None

    @property
    def twitter_consumer_key(self):
        return self._twitter_consumer_key

    @twitter_consumer_key.setter
    def twitter_consumer_key(self, value):
        self._twitter_consumer_key = value

    @property
    def twitter_consumer_secret(self):
        return self._twitter_consumer_secret

    @twitter_consumer_secret.setter
    def twitter_consumer_secret(self, value):
        self._twitter_consumer_secret = value

    @property
    def twitter_access_token(self):
        return self._twitter_access_token

    @twitter_access_token.setter
    def twitter_access_token(self, value):
        self._twitter_access_token = value

    @property
    def twitter_access_token_secret(self):
        return self._twitter_access_token_secret

    @twitter_access_token_secret.setter
    def twitter_access_token_secret(self, value):
        self._twitter_access_token_secret = value

    @property
    def sql_connection_string(self):
        return self._sql_connection_string

    @sql_connection_string.setter
    def sql_connection_string(self, value):
        self._sql_connection_string = value


config = Config()

config.twitter_consumer_key = twitter_config['consumer_key']
config.twitter_consumer_secret = twitter_config['consumer_secret']
config.twitter_access_token = twitter_config['access_token']
config.twitter_access_token_secret = twitter_config['access_token_secret']

config.sql_connection_string = sql_config['connection_string']

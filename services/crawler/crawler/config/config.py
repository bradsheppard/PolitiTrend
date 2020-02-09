import configparser

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')
twitter_config = config_parser['twitter']
contextual_web_config = config_parser['contextual_web']


class Config:

    def __init__(self):
        self.twitter_consumer_key = None
        self.twitter_consumer_secret = None
        self.twitter_access_token = None
        self.twitter_access_token_secret = None
        self.contextual_web_api_key = None

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
    def contextual_web_api_key(self):
        return self._contextual_web_api_key

    @contextual_web_api_key.setter
    def contextual_web_api_key(self, value):
        self._contextual_web_api_key = value


config = Config()

config.twitter_consumer_key = twitter_config['consumer_key']
config.twitter_consumer_secret = twitter_config['consumer_secret']
config.twitter_access_token = twitter_config['access_token']
config.twitter_access_token_secret = twitter_config['access_token_secret']

config.contextual_web_api_key = contextual_web_config['api_key']

import configparser

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')
youtube_config = config_parser['youtube']


class Config:

    def __init__(self):
        self.access_token = None
        self.api_key = None

    @property
    def access_token(self):
        return self._access_token

    @access_token.setter
    def access_token(self, value):
        self._access_token = value

    @property
    def api_key(self):
        return self._api_key

    @api_key.setter
    def api_key(self, value):
        self._api_key = value


config = Config()

config.api_key = youtube_config['api_key']
config.access_token = youtube_config['access_token']


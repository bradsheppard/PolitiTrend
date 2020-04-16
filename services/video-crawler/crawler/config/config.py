import configparser

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')
youtube_config = config_parser['youtube_api']


class Config:

    def __init__(self):
        self.api_key = None

    @property
    def api_key(self):
        return self._api_key

    @api_key.setter
    def api_key(self, value):
        self._api_key = value


config = Config()

config.api_key = youtube_config['api_key']


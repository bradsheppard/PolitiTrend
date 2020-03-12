import configparser

config_parser = configparser.ConfigParser()
config_parser.read('config.ini')
contextual_web_config = config_parser['contextual_web']


class Config:

    def __init__(self):
        self.contextual_web_api_key = None

    @property
    def contextual_web_api_key(self):
        return self._contextual_web_api_key

    @contextual_web_api_key.setter
    def contextual_web_api_key(self, value):
        self._contextual_web_api_key = value


config = Config()

config.contextual_web_api_key = contextual_web_config['api_key']

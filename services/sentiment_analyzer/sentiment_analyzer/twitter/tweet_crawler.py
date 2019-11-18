import tweepy


class TweetCrawler:

    def __init__(self, consumer_key, consumer_secret, access_token, access_token_secret):
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)

        self._api = tweepy.API(auth)

    def get(self, search_term):
        tweets = tweepy.Cursor(self._api.search, q=search_term, lang='en').items(5)
        return [tweet for tweet in tweets]

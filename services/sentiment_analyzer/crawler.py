import tweepy as tw
from sentiment_analyzer.message_bus import MessageBus

consumer_key = '75nqFjIf1ek0bXYeeTli0tj6X'
consumer_secret = 'C0CWq45MlpqxyoTvaRKONBCC1fVtIYLxzZpa3BD1vr0oK1G2Uy'

access_token = '2269069927-a8XMCAhbZy9N9bHMiAOkDdOIjOrDzOPRac6Zhwk'
access_token_secret = 'MqLW8Dz5GIpo1SLdfQOaiAPX1Wd0fI0bD7aM0W3IfTmWC'

queue_host = 'queue-kafka:9092'
consumer_group = 'opinion-group'

auth = tw.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tw.API(auth)

tweets = tw.Cursor(api.search, q='Donald Trump', lang='en').items(5)
bus = MessageBus(queue_host, consumer_group)

for tweet in tweets:
    print(tweet.text)


bus.send(b'New msg')

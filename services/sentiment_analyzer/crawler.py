import tweepy
consumer_key = "wXXXXXXXXXXXXXXXXXXXXXXX1"
consumer_secret = "qXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXh"
access_token = "9XXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXi"
access_token_secret = "kXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXT"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

name = "nytimes"
tweetCount = 20

results = api.user_timeline(id=name, count=tweetCount)

# foreach through all tweets pulled
for tweet in results:
    print(tweet.text)

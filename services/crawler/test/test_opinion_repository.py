import time
import string
import random
from crawler.model import OpinionRepository, Opinion


def test_insert_and_get():
    repository = OpinionRepository()
    opinion = Opinion()
    opinion.politician = 1
    opinion.tweetId = 1
    opinion.tweetText = random_string()
    opinion.sentiment = 2.56

    repository.insert(opinion)

    time.sleep(2)
    inserted_opinions = repository.get_all()

    assert len(inserted_opinions) > 0

    match = False

    for inserted_opinion in inserted_opinions:
        if inserted_opinion.tweetText == opinion.tweetText:
            match = True

    assert match


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))

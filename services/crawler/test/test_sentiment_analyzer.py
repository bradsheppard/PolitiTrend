import pytest
from crawler.ml import SentimentAnalyzer


@pytest.fixture
def sentiment_analyzer(scope='module'):
    sentiment_analyzer = SentimentAnalyzer()
    return sentiment_analyzer


def test_analyze_postive_sentence(sentiment_analyzer):
    sentence = 'What a nice beautiful day'
    prediction = sentiment_analyzer.analyze(sentence)
    assert prediction > 9


def test_analyze_negative_sentence(sentiment_analyzer):
    sentence = 'What a horrible day'
    prediction = sentiment_analyzer.analyze(sentence)
    assert prediction < 1

import pytest
from crawler.ml import SentimentAnalyzer, AnalysisResult


@pytest.fixture
def sentiment_analyzer(scope='module'):
    sentiment_analyzer = SentimentAnalyzer(['Bob Young', 'John Smith'])
    return sentiment_analyzer


def test_analyze_postive_sentence(sentiment_analyzer):
    sentence = 'John Smith is great!'
    prediction: AnalysisResult = sentiment_analyzer.analyze(sentence)
    assert prediction.sentiment > 7


def test_analyze_negative_sentence(sentiment_analyzer):
    sentence = 'John Smith is terrible'
    prediction: AnalysisResult = sentiment_analyzer.analyze(sentence)
    assert prediction.sentiment < 3


def test_analyze_subject_results(sentiment_analyzer):
    sentence = 'Bob Young is awesome. John Smith is terrible though.'
    prediction: AnalysisResult = sentiment_analyzer.analyze(sentence)
    bob_score = prediction.subjectResults['Bob Young']
    john_score = prediction.subjectResults['John Smith']
    assert bob_score > 7
    assert john_score < 3


def test_analyze_non_specific_subject(sentiment_analyzer):
    sentence = 'I\'m awesome'
    prediction: AnalysisResult = sentiment_analyzer.analyze(sentence)
    assert prediction.sentiment > 7
    assert 'Bob Young' not in prediction.subjectResults
    assert 'John Smith' not in prediction.subjectResults

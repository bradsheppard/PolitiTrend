import pytest

from state_party_affiliation_analytic.politician import Politician
from state_party_affiliation_analytic.sentiment_analyzer import get_party_sentiments


@pytest.fixture
def politicians():
    politicians = [
        Politician(1, 'Bob Young', 'Republican'),
        Politician(2, 'John Smith', 'Democrat')
    ]

    return politicians


def test_get_party_sentiments_repeated_party(politicians):
    mean_sentence = 'John Smith is great! John Smith is awful!'
    positive_sentence = 'John Smith is great!'
    negative_sentence = 'John Smith is awful!'

    positive_score = get_party_sentiments([positive_sentence], politicians)
    negative_score = get_party_sentiments([negative_sentence], politicians)
    mean_score = get_party_sentiments([mean_sentence], politicians)

    assert mean_score[0]['Democrat'] == (positive_score[0]['Democrat'] + negative_score[0]['Democrat']) / 2


def test_get_party_sentiments_postive_sentence(politicians):
    sentence = 'John Smith is great!'
    prediction = get_party_sentiments([sentence], politicians)

    assert prediction[0]['Democrat'] > 0.6


def test_get_party_sentiments_multiple_statements(politicians):
    sentence1 = 'John Smith is great!'
    sentence2 = 'Bob Young is great!'

    predictions = get_party_sentiments([sentence1, sentence2], politicians)

    assert predictions[0]['Democrat'] > 0.6
    assert predictions[1]['Republican'] > 0.6


def test_get_party_sentiments_negative_sentence(politicians):
    sentence = 'John Smith is terrible'
    prediction = get_party_sentiments([sentence], politicians)

    assert prediction[0]['Democrat'] < 0.4


def test_get_party_sentiments_subject_results(politicians):
    sentence = 'Bob Young is awesome. John Smith is terrible though.'
    prediction = get_party_sentiments([sentence], politicians)
    bob_score = prediction[0]['Republican']
    john_score = prediction[0]['Democrat']

    assert bob_score > 0.6
    assert john_score < 0.4


def test_get_party_sentiments_non_specific_subject(politicians):
    sentence = 'I\'m awesome'
    prediction = get_party_sentiments([sentence], politicians)

    assert 1 not in prediction
    assert 2 not in prediction

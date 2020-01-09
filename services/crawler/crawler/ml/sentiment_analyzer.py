from typing import Dict
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import spacy


class SentimentAnalyzer:

    def __init__(self):
        self._analyzer = SentimentIntensityAnalyzer()
        self._nlp = spacy.load('en')

    def analyze(self, sentence: str) -> Dict[str, float]:
        subject_scores = {}
        doc = self._nlp(sentence)
        for token in doc:
            if token.dep_ == 'nsubj':
                scores = self._analyzer.polarity_scores(token.sent.text)
                score = scores['compound']
                subject_scores[token] = score * 5 + 5
        return subject_scores

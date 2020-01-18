from typing import List, Dict, Union
import spacy
from attr import dataclass
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


@dataclass(init=False)
class AnalysisResult:
    sentiment: float
    subjectResults: Dict[str, float]


@dataclass
class SentenceSubjectResult:
    sentiment: float
    subject: str
    pos: str


class SentimentAnalyzer:

    def __init__(self, subjects: List[str] = None):
        self._analyzer = SentimentIntensityAnalyzer()
        self._nlp = spacy.load('en')
        self._subjects = subjects

    def analyze(self, statement: str) -> AnalysisResult:
        analysis_result = AnalysisResult()
        scores = self._analyzer.polarity_scores(statement)
        analysis_result.sentiment = self._normalize_score(scores['compound'])
        analysis_result.subjectResults = {}

        sentences_subject_results: Dict[int, Dict[str, SentenceSubjectResult]] = {}
        doc = self._nlp(statement)
        for token in doc:
            subject = self._lookup_subject(token.text)
            if subject is None:
                continue
            score = self._analyzer.polarity_scores(token.sent.text)['compound']
            adjusted_score = self._normalize_score(score)
            subject_result = SentenceSubjectResult(sentiment=adjusted_score, subject=subject, pos=token.dep_)
            if token.sent.start not in sentences_subject_results:
                sentences_subject_results[token.sent.start] = {}
            sentences_subject_results[token.sent.start][subject] = subject_result

        for sentence_subject_results in sentences_subject_results.values():
            if len(sentence_subject_results.keys()) == 0:
                continue
            elif len(sentence_subject_results.keys()) == 1:
                key = list(sentence_subject_results.keys())[0]
                analysis_result.subjectResults[sentence_subject_results[key].subject] = \
                    sentence_subject_results[key].sentiment
                analysis_result.sentiment = sentence_subject_results[key].sentiment
                continue
            for subject in sentence_subject_results.keys():
                subject_result = sentence_subject_results[subject]
                if subject_result.pos == 'nsubj' or subject_result.pos == 'compound':
                    continue
                analysis_result.subjectResults[subject_result.subject] = subject_result.sentiment

        return analysis_result

    @staticmethod
    def _normalize_score(score: float):
        return score * 5 + 5

    def _lookup_subject(self, sentence_subject: str) -> Union[str, None]:
        if self._subjects is None:
            return None

        for subject in self._subjects:
            subject_words = subject.split()
            for subject_word in subject_words:
                if sentence_subject.lower() == subject_word.lower():
                    return subject
        return None

from typing import List, Dict, Union
import spacy
from attr import dataclass
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


@dataclass(init=False)
class AnalysisResult:
    sentiment: float
    subjectResults: Dict[str, float]


@dataclass()
class SubjectResult:
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

        subject_results = {}
        doc = self._nlp(statement)
        for token in doc:
            subject = self._lookup_subject(token.text)
            if subject is None:
                continue
            scores = self._analyzer.polarity_scores(token.sent.text)
            score = scores['compound']
            adjusted_score = self._normalize_score(score)
            subject_result = SubjectResult(sentiment=adjusted_score, subject=subject, pos=token.dep_)
            subject_results[token.sent.start].append(subject_result)

            analysis_result.subjectResults[subject] = adjusted_score

        for key in subject_results.keys():
            subject_results =

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

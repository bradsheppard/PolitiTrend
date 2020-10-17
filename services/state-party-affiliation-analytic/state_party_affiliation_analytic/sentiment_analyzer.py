import spacy
from typing import Dict, List, Union
from statistics import mean

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from state_party_affiliation_analytic.politician import Politician

sentiment_analyzer = SentimentIntensityAnalyzer()

nlp = spacy.load('en', disable=['ner', 'entity_linker', 'textcat', 'entity_ruler',
                                'merge_entities'])


def get_party_sentiments(statements: List[str], subjects: List[Politician] = None) -> List[Dict[str, float]]:
    results_list = []
    for doc in nlp.pipe(statements):
        results = {}
        for sent in doc.sents:
            score = sentiment_analyzer.polarity_scores(sent.text)['compound']
            pos_subjects = _get_pos_subjects(sent, ['VERB', 'ADJ', 'NOUN'], subjects)

            max_length = 0
            for subject in pos_subjects.values():
                if len(subject) > max_length:
                    max_length = len(subject)

            for key in pos_subjects:
                if len(pos_subjects[key]) == max_length and max_length is not 0:
                    if key not in results:
                        results[key] = [score]
                    else:
                        results[key].append(score)

        for key in results:
            results[key] = mean(results[key])

        results_list.append(results)

    return results_list


def _get_pos_subjects(doc, pos_list, politicians) -> Dict[str, List[str]]:
    verbs = {politician.party: [] for politician in politicians}
    for possible_verb in doc:
        if possible_verb.pos_ in pos_list:
            found_child = False
            children = possible_verb.children
            for child in children:
                match = _match_politician(child.text, politicians)
                if match is not None and child.dep_ == 'nsubj':
                    verbs[match.party].append(possible_verb)
                    _traverse_subject_conjs(child, possible_verb, verbs, politicians)
                    found_child = True
            if not found_child:
                _traverse_up(possible_verb, possible_verb, verbs, politicians)
    return verbs


def _match_politician(text, politicians) -> Union[Politician, None]:
    for politician in politicians:
        split_name = politician.name.split()
        if text in split_name:
            return politician
    return None


def _traverse_up(possible_verb, current, verbs, politicians):
    head = current.head
    if current == head:
        return
    children = head.children
    for child in children:
        match = _match_politician(child.text, politicians)
        if match is not None and child.dep_ == 'nsubj':
            verbs[match.party].append(possible_verb)
            _traverse_subject_conjs(child, possible_verb, verbs, politicians)
    _traverse_up(possible_verb, head, verbs, politicians)


def _traverse_subject_conjs(subj, possible_verb, verbs, politicians):
    children = subj.children
    for child in children:
        if child.dep_ == 'conj':
            match = _match_politician(child.text, politicians)
            if match is not None:
                verbs[match.party].append(possible_verb)
                _traverse_subject_conjs(child, possible_verb, verbs, politicians)

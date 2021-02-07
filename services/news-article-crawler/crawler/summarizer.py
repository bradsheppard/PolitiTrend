import spacy

from typing import List, Union
from transformers import pipeline


class Summarizer:
    batch_size = 5

    def __init__(self):
        self._nlp = spacy.load('en')
        self._summarizer = pipeline("summarization", model="facebook/bart-large-cnn",
                                    tokenizer="facebook/bart-large-cnn", framework="tf")

    def summarize(self, input_text: str) -> Union[str, None]:
        return self.summarize_all([input_text])[0]

    def summarize_all(self, inputs: List[str]) -> List[Union[str, None]]:
        results = []

        for i in range(0, len(inputs), Summarizer.batch_size):
            batch = inputs[i:i + Summarizer.batch_size]
            batch_summaries = self._summarizer(
                batch, min_length=3, max_length=30, top_k=20, top_p=0.95, num_return_sequences=3)

            for j in range(0, len(batch_summaries), 3):
                summaries = batch_summaries[j:j + 3]
                cleaned_summaries = []
                for summary in summaries:
                    text = summary['summary_text']
                    cleaned_summaries.append(self._strip_incomplete(text))

                results.append(Summarizer._pick_most_relevant(cleaned_summaries))

        return results

    @staticmethod
    def _pick_most_relevant(sentences: List[str]) -> Union[str, None]:
        resulting_sentence = ''

        for sentence in sentences:
            if len(sentence) > len(resulting_sentence):
                resulting_sentence = sentence

        if resulting_sentence == '':
            return None

        return resulting_sentence

    def _strip_incomplete(self, sentences: str) -> str:
        doc = self._nlp(sentences)

        resulting_sentences = []
        for sent in doc.sents:
            if sent[-1].text == '.':
                has_noun = 1
                has_verb_or_adj = 1
                for token in sent:
                    if token.pos_ in ["NOUN", "PROPN", "PRON"]:
                        has_noun -= 1
                    elif token.pos_ == "VERB" or token.pos_ == "ADJ":
                        has_verb_or_adj -= 1
                if has_noun < 1 and has_verb_or_adj < 1:
                    resulting_sentences.append(sent.string.strip())
        return ' '.join(resulting_sentences)

    @staticmethod
    def _decode(input_bytes):
        return input_bytes.decode('utf-8')

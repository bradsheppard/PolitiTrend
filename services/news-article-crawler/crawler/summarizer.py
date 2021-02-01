from typing import List
from transformers import pipeline


class Summarizer:

    batch_size = 5

    def __init__(self):
        self._summarizer = pipeline("summarization", model="facebook/bart-large-cnn",
                                    tokenizer="facebook/bart-large-cnn", framework="tf")

    def summarize(self, input_text: str) -> str:
        summary = self._summarizer(input_text, min_length=10, max_length=30)
        return summary[0]['summary_text']

    def summarize_all(self, inputs: List[str]) -> List[str]:
        results = []

        for i in range(0, len(inputs), Summarizer.batch_size):
            batch = inputs[i:i+Summarizer.batch_size]
            summarys = list(map(lambda x: x['summary_text'], self._summarizer(batch, min_length=10, max_length=30)))
            results.extend(summarys)

        return results

    @staticmethod
    def _decode(input_bytes):
        return input_bytes.decode('utf-8')

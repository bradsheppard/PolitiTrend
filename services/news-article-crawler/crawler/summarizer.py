from typing import List

import tensorflow.compat.v1 as tf
import tensorflow_hub as hub
import tensorflow_text as text

tf.disable_eager_execution()


class Summarizer:

    batch_size = 2

    def __init__(self):
        g = tf.Graph()
        with g.as_default():
            text_input = tf.placeholder(dtype=tf.string, shape=[None])
            summarizer = hub.Module('https://tfhub.dev/google/bertseq2seq/roberta24_bbc/1', name='summarizer')
            summarization = summarizer(text_input)
            init_op = tf.group([tf.global_variables_initializer(), tf.tables_initializer()])
        g.finalize()

        session = tf.Session(graph=g)
        session.run(init_op)

        self._session = session
        self._summarization = summarization
        self._text_input = text_input

    def summarize(self, input_text: str):
        returned_bytes = self._session.run(self._summarization, feed_dict={self._text_input: [input_text]})[0]
        return self._decode(returned_bytes)

    def summarize_all(self, inputs: List[str]):
        results = []

        for i in range(0, len(inputs), Summarizer.batch_size):
            batch = inputs[i:i+Summarizer.batch_size]

            returned_bytes = self._session.run(self._summarization, feed_dict={self._text_input: batch})
            strings = list(map(self._decode, returned_bytes))
            results.extend(strings)

        return results

    @staticmethod
    def _decode(input_bytes):
        return input_bytes.decode('utf-8')

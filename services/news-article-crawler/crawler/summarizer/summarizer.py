import tensorflow.compat.v1 as tf
import tensorflow_hub as hub
import tensorflow_text as text

tf.disable_eager_execution()


class Summarizer:

    def __init__(self):
        self._summarizer = hub.Module('https://tfhub.dev/google/bertseq2seq/roberta24_gigaword/1', name='summarizer')

        session = tf.compat.v1.Session()
        session.run(tf.tables_initializer())
        session.run(tf.global_variables_initializer())

        self._session = session

    def summarize(self, input_text):
        returned_bytes = self._session.run(self._summarizer([input_text]))[0]
        return returned_bytes.decode('utf-8')

import os
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences


class SentimentAnalyzer:
    accepted_chars = 'abcdefghijklmnopqrstuvwxyz '

    def __init__(self):
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

        model_path = os.path.join(__location__, 'trained_model.h5')
        tokenizer_path = os.path.join(__location__, 'tokenizer.pickle')

        self.model = load_model(model_path)
        self.tokenizer = self.__load_tokenizer(tokenizer_path)

    def __normalize(self, line):
        new_line = line.replace('rt', ' ')
        new_chars = [c.lower() for c in new_line if c.lower() in self.accepted_chars]
        return ''.join(new_chars)

    @staticmethod
    def __load_tokenizer(tokenizer_path: str):
        with open(tokenizer_path, 'rb') as handle:
            tokenizer = pickle.load(handle)
            return tokenizer

    def analyze(self, sentence: str) -> float:
        normalized_sentence = self.__normalize(sentence)
        sequences = self.tokenizer.texts_to_sequences([normalized_sentence])
        sequences = pad_sequences(sequences, maxlen=40)
        prediction = self.model.predict(sequences)
        return prediction[0][1] * 10

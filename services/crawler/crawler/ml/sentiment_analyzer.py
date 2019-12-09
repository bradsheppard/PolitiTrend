import os
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences


class SentimentAnalyzer:

    def __init__(self):
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

        model_path = os.path.join(__location__, 'trained_model.h5')
        tokenizer_path = os.path.join(__location__, 'tokenizer.pickle')

        self.model = load_model(model_path)
        self.tokenizer = self.load_tokenizer(tokenizer_path)

    @staticmethod
    def load_tokenizer(tokenizer_path: str):
        with open(tokenizer_path, 'rb') as handle:
            tokenizer = pickle.load(handle)
            return tokenizer

    def analyze(self, sentence: str) -> float:
        sequences = self.tokenizer.texts_to_sequences([sentence])
        sequences = pad_sequences(sequences, maxlen=40)
        prediction = self.model.predict(sequences)
        return prediction[0][1] * 10

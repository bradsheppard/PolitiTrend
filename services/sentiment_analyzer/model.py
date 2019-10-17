from keras.models import Sequential
from keras.layers import Dense, Embedding
from keras.layers import LSTM

import pandas as pd

pd.read_csv('data/training.1600000.processed.noemoticon.csv', encoding='utf-8', engine='python')

model = Sequential()
model.add(Embedding(500, 32))
model.add(LSTM(32, dropout=0.2, recurrent_dropout=0.2))
model.add(Dense(1, activation='sigmoid'))

model.compile(loss='binary_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])

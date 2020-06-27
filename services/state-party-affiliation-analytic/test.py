import geograpy
import nltk
import pandas as pd

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

states = pd.read_csv('state_party_affiliation_analytic/state_lookup/state_list.csv')

test = 'Some place (New York)'
places = geograpy.get_place_context(text=test)
print(places.regions)

print(states)

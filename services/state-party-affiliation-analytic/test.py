import geograpy
import nltk

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

test = 'Some place (New York)'
places = geograpy.get_place_context(text=test)
print(places.regions)
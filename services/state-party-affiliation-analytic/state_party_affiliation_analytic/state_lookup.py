from typing import Union

import os
import geograpy
import pandas as pd
import nltk

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

script_dir = os.path.dirname(__file__)
state_dataframe = pd.read_csv(script_dir + '/state_list.csv')


def get_state(location: str) -> Union[str, None]:
    if not location:
        return None

    try:
        regions = geograpy.get_place_context(text=location).regions
    except AttributeError as err:
        print('Attribute error: {0}'.format(err))
        return None

    for region in regions:
        for _, row in state_dataframe.iterrows():
            if region in (row['State'], row['Abbreviation']):
                return row['Abbreviation']

    return None

from typing import Union

import os
import geograpy
import pandas as pd

script_dir = os.path.dirname(__file__)
state_dataframe = pd.read_csv(script_dir + '/state_list.csv')


def get_state(location: str) -> Union[str, None]:
    if not location:
        return None

    regions = geograpy.get_place_context(text=location).regions

    for region in regions:
        for _, row in state_dataframe.iterrows():
            if region == row['State'] or region == row['Abbreviation']:
                return row['Abbreviation']

    return None





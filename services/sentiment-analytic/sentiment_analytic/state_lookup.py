from typing import Union

import os
import pandas as pd

script_dir = os.path.dirname(__file__)
state_dataframe = pd.read_csv(script_dir + '/state_list.csv')


def get_state(location: str) -> Union[str, None]:
    if not location:
        return None

    print(script_dir)
    print(location)

    for _, row in state_dataframe.iterrows():
        print(row['State'])
        location_lower = location.lower()
        state = row['State']
        abbreviation = row['Abbreviation']

        if state.lower() in location_lower:
            return abbreviation

        match1 = ' ' + abbreviation.lower() + '.'
        match2 = ' ' + abbreviation.lower()
        match3 = ',' + abbreviation.lower()

        if location_lower.endswith(match1) or location_lower.endswith(match2) or \
                location_lower.endswith(match3):
            return abbreviation

    print('RETURNING NONE')
    return None

# pylint: disable=redefined-outer-name

import pytest
import pandas as pd


@pytest.fixture()
def index():
    arrays = [
        ['Democratic', 'Democratic', 'Republican', 'Republican'],
        ['count', 'mean', 'count', 'mean']
    ]
    tuples = list(zip(*arrays))

    index = pd.MultiIndex.from_tuples(tuples)
    return index

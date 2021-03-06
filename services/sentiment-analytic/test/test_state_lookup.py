from sentiment_analytic.state_lookup import get_state


def test_lookup_state_by_alias():
    location = 'Some place, MN'
    state = get_state(location)
    assert state == 'MN'


def test_lookup_state_by_full_name():
    location = 'New York'
    state = get_state(location)
    assert state == 'NY'


def test_lookup_empty_string():
    location = ''
    state = get_state(location)
    assert state is None


def test_lookup_without_state():
    location = 'random string'
    state = get_state(location)
    assert state is None

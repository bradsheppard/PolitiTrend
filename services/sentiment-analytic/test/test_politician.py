from sentiment_analytic.politician import get_all


def test_get_all():
    politicians = get_all()
    assert len(politicians) > 0

from crawler.politician import get_all


def test_get_all():
    politicians = get_all()
    assert len(politicians) > 0

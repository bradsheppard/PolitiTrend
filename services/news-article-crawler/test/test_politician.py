from crawler.politician import get_all


def test_get_all():
    politicians = get_all()

    for i in range(len(politicians) - 1):
        current_entry = politicians[i]
        next_entry = politicians[i + 1]

        assert current_entry.sampleSize >= next_entry.sampleSize

    assert len(politicians) > 0

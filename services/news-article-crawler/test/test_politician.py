from crawler.container import Container


def test_get_all():
    container = Container()
    repository = container.politician_repository()

    politicians = repository.get_all()
    assert len(politicians) > 0

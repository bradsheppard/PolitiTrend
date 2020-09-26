from crawler.politician import PoliticianRepository


def test_get_all():
    repository = PoliticianRepository()
    politicians = repository.get_all()
    assert len(politicians) > 0

import pytest

from crawler.container import Container


@pytest.fixture
def summarizer():
    container = Container()
    summarizer = container.summarizer()

    return summarizer


def test_summarize(summarizer):
    text = 'Donald trump did something today that was pretty awful. He got rid of healthcare.'
    summary = summarizer.summarize(text)
    assert type(summary) == str and len(summary) > 0

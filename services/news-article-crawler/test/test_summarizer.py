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


def test_summarize_all(summarizer):
    text1 = 'Donald trump did something today that was pretty awful. He got rid of healthcare.'
    text2 = text1
    summaries = summarizer.summarize_all([text1, text2])

    assert len(summaries) == 2

    for summary in summaries:
        assert type(summary) == str and len(summary) > 0

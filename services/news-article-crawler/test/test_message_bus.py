import time

from crawler.container import Container


def test_receive_message():
    container = Container()
    message_bus = container.message_bus()

    message_bus.send(b'test_message')
    time.sleep(5)
    response = message_bus.consume_one()
    assert response.value == b'test_message'

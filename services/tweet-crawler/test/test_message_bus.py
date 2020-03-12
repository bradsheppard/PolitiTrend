import time
from crawler.message_bus import MessageBus


def test_receive_message():
    message_bus = MessageBus('queue-kafka-bootstrap:9092', 'tweet-created')
    message_bus.send(b'test_message')
    time.sleep(5)
    response = message_bus.consume_one()
    assert response.value == b'test_message'

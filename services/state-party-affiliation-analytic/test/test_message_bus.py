import time
from state_party_affiliation_analytic.message_bus import MessageBus


def test_receive_message():
    message_bus = MessageBus('queue-kafka-bootstrap:9092', 'state-party-affiliation-created')
    message_bus.send(b'test_message')
    time.sleep(5)
    response = message_bus.consume_one()
    assert response.value == b'test_message'

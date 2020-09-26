from kafka import KafkaConsumer, KafkaProducer


class MessageBus:

    def __init__(self, host: str, topic: str):
        self._consumer = KafkaConsumer(topic, bootstrap_servers=host, group_id='video-crawler')
        self._producer = KafkaProducer(bootstrap_servers=host)
        self._topic = topic

    def send(self, message):
        future = self._producer.send(self._topic, message)
        future.get(timeout=60)

    def consume(self):
        for message in self._consumer:
            message = message.value
            print('Message received ' + message)

    def consume_one(self):
        return next(self._consumer)

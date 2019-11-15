from kafka import KafkaConsumer, KafkaProducer


class MessageBus:

    def __init__(self, host, group):
        self.consumer = KafkaConsumer('opinion', bootstrap_servers=host, group_id=group)
        self.producer = KafkaProducer(bootstrap_servers=host)

    def send(self, message):
        future = self.producer.send('opinion', message)
        future.get(timeout=60)

    def consume(self):
        for message in self.consumer:
            message = message.value
            print('Message received ' + message)

    def consume_one(self):
        return next(self.consumer)

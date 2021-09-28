import { CompressionTypes, Message, Producer as KafkaProducer } from 'kafkajs'
import kafka from './kafka'

export default class Producer {
  constructor(private producer: KafkaProducer = kafka.producer({ allowAutoTopicCreation: true })) {}

  public async connect() {
    await this.producer.connect()
  }

  public async disconnect() {
    await this.producer.disconnect()
  }

  public async sendMessage(
    messages: Array<Message>,
    topic: string,
    compression?: CompressionTypes
  ) {
    await this.producer.send({
      topic,
      messages,
      compression,
    })
  }
}

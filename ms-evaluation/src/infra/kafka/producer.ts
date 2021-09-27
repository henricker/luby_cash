import { CompressionTypes, Message, Producer as KafkaProducer } from 'kafkajs'

export default class Producer {
  constructor(private producer: KafkaProducer) {}

  public async connect() {
    await this.producer.connect()
  }

  public async disconect() {
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

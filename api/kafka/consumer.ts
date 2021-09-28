import { Consumer as KafkaConsumer, ConsumerSubscribeTopic } from 'kafkajs'
import kafka from './kafka'
import KafkaConsumerContract from './consumer-service-contract'

export default class Consumer {

  constructor(private kafkaConsumer: KafkaConsumer = kafka.consumer({ allowAutoTopicCreation: true, groupId: 'ms_evaluation' })) {}

  async connect(): Promise<void> {
    await this.kafkaConsumer.connect()
  }

  async disconnect(): Promise<void> {
    await this.kafkaConsumer.disconnect()
  }

  async subscribe(topics: ConsumerSubscribeTopic[]): Promise<void> {
    topics.forEach(async (options) => await this.kafkaConsumer.subscribe({ ...options  }))
  }

  async run(contract: KafkaConsumerContract) {
    await this.kafkaConsumer.run({
      eachMessage: async ({ message, partition, topic }) => {
        if(topic !== contract.topic)
          return
          
        contract.handler({ message, partition, topic })
      }
    })
  }
}
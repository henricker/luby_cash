import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  brokers: ['localhost:9092']
})

export default kafka
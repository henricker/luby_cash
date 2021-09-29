import { readdirSync } from 'fs'
import { ConsumerSubscribeTopic } from 'kafkajs'
import Consumer from '../kafka/consumer'
import KafkaConsumerContract from '../kafka/consumer-service-contract'
import path from 'path'
;(async () => {
  const consumer = new Consumer()

  const consumers = await Promise.all(
    readdirSync(path.resolve(__dirname, '..', 'app', 'KafkaConsumers'))
      .filter((filename) => !/index.[ts, js]/.test(filename))
      .map(async (filename) => {
        const consumerObject = await import(`../app/KafkaConsumers/${filename}`)
        return consumerObject.default
      })
  )

  const topicsToSubscribe = consumers.map((consumerobject: KafkaConsumerContract) => {
    const topicPayload: ConsumerSubscribeTopic = {
      topic: consumerobject.topic,
    }

    return topicPayload
  })

  await consumer.connect()
  await consumer.subscribe(topicsToSubscribe)

  for await (let consumerObject of consumers) {
    await consumer.run(consumerObject)
  }
})()

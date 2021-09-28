import { readdirSync } from "fs";
import { ConsumerSubscribeTopic } from "kafkajs";
import Consumer from "../../infra/kafka/consumer";
import KafkaConsumerContract from "../../infra/kafka/consumer-contract";

(async () => {
  const consumer = new Consumer()

  const consumers = await Promise.all(readdirSync(__dirname)
  .filter((filename) => !/index.[ts, js]/.test(filename))
  .map(async (filename) => {
    const consumerObject = await import(`./${filename}`)
    return consumerObject.default
  }))

  const topicsToSubscribe = consumers.map((consumerobject: KafkaConsumerContract) => {
    const topicPayload: ConsumerSubscribeTopic = {
      topic: consumerobject.topic
    }

    return topicPayload
  })

  await consumer.connect()
  await consumer.subscribe(topicsToSubscribe)

  for await (let consumerObject of consumers) {
    await consumer.run(consumerObject)
  }
})()
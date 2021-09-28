import { EachMessagePayload } from "kafkajs";
import Consumer from "../../infra/kafka/consumer";
import Producer from "../../infra/kafka/producer";
import createCustomerConsumerContract from "./create-customer";

(async () => {
  // const producer = new Producer()

  // await producer.connect()
  // await producer.sendMessage([
  //   {
  //     value: 'hello babe'
  //   },
  // ], 'evaluation-event')
  // await producer.disconect()

  const consumer = new Consumer()
  await consumer.connect()

  await consumer.subscribe([ { topic: 'evaluation-event' }])
  await consumer.run(createCustomerConsumerContract)

})()
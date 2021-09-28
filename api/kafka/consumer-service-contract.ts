import { EachMessagePayload } from "kafkajs";

export default interface KafkaConsumerContract {
  topic: string
  handler(payloadTopic: EachMessagePayload): Promise<void> 
}
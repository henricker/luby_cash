import kafka from "../../src/infra/kafka/kafka"
import Producer from "../../src/infra/kafka/producer"


describe('#Producer', () => {
  const kafkaProducer = kafka.producer({ allowAutoTopicCreation: true })
  describe('#connect', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test('should be called connect method of kafkaConsumer', async () => {
      jest.spyOn(kafkaProducer, 'connect').mockImplementation()
      const producer = new Producer(kafkaProducer)

      await producer.connect()
      expect(kafkaProducer.connect).toBeCalled()
    })
  })

  describe('#disconnect', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test('should be called disconnect method of kafkaProducer', async () => {
      jest.spyOn(kafkaProducer, 'connect').mockImplementation()
      jest.spyOn(kafkaProducer, 'disconnect').mockImplementation()
      const producer = new Producer(kafkaProducer)

      await producer.disconnect()
      expect(kafkaProducer.disconnect).toBeCalled()
    })
  })

  describe('#sendMessage', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test('should be called send method of kafkaProducer', async () => {
      jest.spyOn(kafkaProducer, 'connect').mockImplementation()
      jest.spyOn(kafkaProducer, 'disconnect').mockImplementation()
      jest.spyOn(kafkaProducer, 'send').mockImplementation()
        
      const producer = new Producer(kafkaProducer)
      await producer.sendMessage([
        {
          value: 'hello babe'
        },
      ], 'random-event')

      expect(kafkaProducer.send).toBeCalledWith({"compression": undefined, "messages": [{"value": "hello babe"}], "topic": "random-event"})
    })
  })
})
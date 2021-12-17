import {Controller} from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() {
  }

  @MessagePattern('transactionTesting.Kafka')
  readTransactionMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const response =
      `Receiving a new message from topic: transaction.Kafka: ` +
      JSON.stringify(originalMessage.value);
    console.log(response);
    return response;
  }

  @MessagePattern('account.Kafka')
  readAccountMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const response =
      `Receiving a new message from topic: account.Kafka: ` +
      JSON.stringify(originalMessage.value);
    console.log(response);
    return response;
  }
}
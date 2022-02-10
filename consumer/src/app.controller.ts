import { Controller } from '@nestjs/common';
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

  @MessagePattern("data-lake-categorization")
  readTransactionMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    console.log(message, 'messagemessagemessagemessage');

    const response =
      `Receiving a new message from topic: transaction.Kafka: ` +
      JSON.stringify(originalMessage.value);
    console.log(response);
    return response;
  }

  // @MessagePattern('testing123')
  // readAccountMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
  //   const originalMessage = context.getMessage();
  //   const response =
  //     `Receiving a new message from topic: wipe-data: ` +
  //     JSON.stringify(originalMessage.value);
  //   console.log(response);
  //   return response;
  // }
}
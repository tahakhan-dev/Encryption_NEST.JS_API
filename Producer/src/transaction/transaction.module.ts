import { Module } from '@nestjs/common';
import 'dotenv/config';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import {ClientsModule, Transport} from '@nestjs/microservices';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.KAFKA_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [process.env.BROKER_IP],
          },
          consumer: {
            groupId: process.env.CONSUMER_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}

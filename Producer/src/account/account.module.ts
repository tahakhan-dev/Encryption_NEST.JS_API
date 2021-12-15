import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import {ClientsModule, Transport} from '@nestjs/microservices';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TransactionKafa',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'testingKafka',
            brokers: ['34.93.111.157:29092'],
          },
          consumer: {
            groupId: 'tran_kafka_123',
          },
        },
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}

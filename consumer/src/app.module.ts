import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import * as fs from 'fs';


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
            ssl: {
              key: fs.readFileSync(process.env.KAFKA_SSL_KEY_FILE, 'utf-8'),
              cert: fs.readFileSync(process.env.KAFKA_SSL_CERT_FILE, 'utf-8'),
              ca: [fs.readFileSync(process.env.KAFKA_SSL_CA_FILE, 'utf-8')],
              passphrase: process.env.KAFKA_SSL_PASSPHRASE,
              rejectUnauthorized: false,
            },
          },
          // producer:{
          //   allowAutoTopicCreation:false
          // },
          consumer: {
            groupId: process.env.CONSUMER_GROUP_ID,
            allowAutoTopicCreation: false
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
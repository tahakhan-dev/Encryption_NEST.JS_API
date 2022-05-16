import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          // brokers: [process.env.BROKER_IP],
          brokers: ['localhost:29092'],
          ssl: false
          // ssl: {
          //   key: fs.readFileSync(process.env.KAFKA_SSL_KEY_FILE, 'utf-8'),
          //   cert: fs.readFileSync(process.env.KAFKA_SSL_CERT_FILE, 'utf-8'),
          //   ca: [fs.readFileSync(process.env.KAFKA_SSL_CA_FILE, 'utf-8')],
          //   passphrase: process.env.KAFKA_SSL_PASSPHRASE,
          //   rejectUnauthorized: false,
          // },
        },
        consumer: {
          groupId: process.env.CONSUMER_GROUP_ID,
          // allowAutoTopicCreation: false
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import * as fs from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mccMapper } from './entities/mcc_mapper.entity';
import { mcCodes } from './entities/mcc_codes.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DBSERVER,
      port: 1433,
      username: process.env.DBUSER,
      password: process.env.DBPASSWORD,
      database: process.env.DBNAME,
      entities: [
        "./dist/**/entities/*.entity{.ts,.js}"
      ],
      synchronize: false,
      options: { useUTC: true },
    }),
    TypeOrmModule.forFeature([mccMapper, mcCodes, Category]),
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
            allowAutoTopicCreation: true
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
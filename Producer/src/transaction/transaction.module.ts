import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TransactionCommandHandler } from './commands.handler';
import { TransactionQueryHandler } from './query.handler';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { TransactionController } from './transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionCommand } from './commands/transaction.command';
import * as fs from 'fs';
import 'dotenv/config';


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
                    producer: {
                        allowAutoTopicCreation: false
                    }
                },

            },
        ]),
        CqrsModule
    ],
    providers: [
        TransactionService,
        TransactionRepository,
        TransactionCommandHandler,
        TransactionCommand,
        TransactionQueryHandler,
    ],
    controllers: [TransactionController],
    exports: [TransactionService],
})
export class TransactionModule { }

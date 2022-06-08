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
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accountss } from 'src/entities/Account.entity';
import { mccMapper } from 'src/entities/mcc_mapper.entity';
import { mcCodes } from 'src/entities/mcc_codes.entity';
import { Category } from 'src/entities/category.entity';
import { unCategorizedTransactions } from 'src/entities/unCategorizedTransactions.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Accountss,mccMapper, mcCodes, Category, unCategorizedTransactions]),
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

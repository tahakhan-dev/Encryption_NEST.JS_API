import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AccountCommandHandler } from './commands.handler';
import { AccountQueryHandler } from './query.handler';
import { AccountService } from './Account.service';
import { AccountRepository } from './Account.repository';
import { AccountController } from './Account.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AccountCommand } from './commands/Account.command';
import * as fs from 'fs';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accountss } from 'src/entities/Account.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Accountss]),
        CqrsModule
    ],
    providers: [
        AccountService,
        AccountRepository,
        AccountCommandHandler,
        AccountCommand,
        AccountQueryHandler,
    ],
    controllers: [AccountController],
    exports: [AccountService],
})
export class AccountModule { }

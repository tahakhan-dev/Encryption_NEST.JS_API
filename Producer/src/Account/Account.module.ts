import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AccountCommandHandler } from './commands.handler';
import { AccountQueryHandler } from './query.handler';
import { AccountService } from './Account.service';
import { AccountRepository } from './Account.repository';
import { AccountController } from './Account.controller';
import { AccountCommand } from './commands/Account.command';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accountss } from 'src/entities/Account.entity';
import { AuthenticationUserMiddleware } from 'src/middlewares/authentication.middleware';
import { DecryptUserMiddleware } from 'src/middlewares/decrypt.middleware';


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
export class AccountModule { 
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationUserMiddleware,DecryptUserMiddleware).forRoutes('*');
      }
}

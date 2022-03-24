import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule as EnvConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';
import { AccountModule } from './Account/Account.module';

@Module({
  imports: [EnvConfigModule.forRoot(),
    TransactionModule,
    AccountModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      }),
    }],
})
export class AppModule { }

import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TransactionCommand } from './commands/transaction.command';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }
  async CreateTransactionServiceHandler(TransactionDto: TransactionDto[]) {
    return await this.commandBus.execute(
      new TransactionCommand(TransactionDto),
    );
  }


}

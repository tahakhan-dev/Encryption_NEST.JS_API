import { ICommand } from '@nestjs/cqrs';
import { TransactionDto } from '../dto/transaction.dto';

export class TransactionCommand implements ICommand {
    constructor(
        public readonly TransactionDto: TransactionDto[],
    ) { }
}

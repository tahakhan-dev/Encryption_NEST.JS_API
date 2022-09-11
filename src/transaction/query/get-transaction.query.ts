import { IQuery } from '@nestjs/cqrs';
import { TransactionDto } from '../dto/transaction.dto';

export class GetTransactionQuery implements IQuery {
    public constructor(
        public readonly param: TransactionDto,
    ) { }
}

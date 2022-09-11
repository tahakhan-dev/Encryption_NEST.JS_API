import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";;
import { TransactionCommand } from "./commands/transaction.command";
import { TransactionRepository } from "./transaction.repository";
import { TransactionDto } from './dto/transaction.dto';

@CommandHandler(TransactionCommand)
export class TransactionCommandHandler implements ICommandHandler<TransactionCommand> {
    constructor(
        private readonly TransactionRepo: TransactionRepository,
        private readonly publisher: EventPublisher,
    ) { }

    // @ts-ignore
    async execute(command: TransactionCommand, resolve: (value?) => void): Promise<any> {

        const Transactions = this.publisher.mergeObjectContext(
            await this.TransactionRepo.createTransaction(command.TransactionDto),
        );
        return true;
    }
}
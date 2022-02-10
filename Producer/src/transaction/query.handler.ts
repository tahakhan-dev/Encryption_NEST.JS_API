import { EventPublisher, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransactionQuery } from "./query/get-transaction.query";
import { TransactionRepository } from "./transaction.repository";

@QueryHandler(GetTransactionQuery)
export class TransactionQueryHandler implements IQueryHandler<any> {
    constructor(
        private readonly repository: TransactionRepository,
        private readonly publisher: EventPublisher,
    ) { }

    // @ts-ignore
    async execute(query: GetTransactionQuery, resolve: (value?) => void) {
        // const Userdetails = this.publisher.mergeObjectContext(
        //     // await this.repository.GetUser(query.param),
        // );
        return true;
    }
}
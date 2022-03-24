import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { TransactionDto } from "./dto/transaction.dto";
import 'dotenv/config';


@Injectable()
export class TransactionRepository {
    constructor(
        @Inject(process.env.KAFKA_NAME) private readonly client: ClientKafka,
    ) { }

    async createTransaction(TransactionDto: TransactionDto[]) {
        return await this.produceTransaction(TransactionDto)
    }

    private async produceTransaction(TransactionDto: TransactionDto[]): Promise<any> {

        if (TransactionDto.length != undefined && TransactionDto.length > 0) {
            for (let element of TransactionDto) {
                console.log('=======================emitting============================');
                console.log(JSON.stringify(element));
                console.log('=======================emitting============================');
                this.client.emit(process.env.KAFKA_TOPIC, { key: `${element.id}`, value: JSON.stringify(element) })
            }
        } else {
            console.log('================================JSON.stringify(TransactionDto)===================');
            console.log(JSON.stringify(TransactionDto));
            console.log('================================JSON.stringify(TransactionDto)===================');
            this.client.emit(process.env.KAFKA_TOPIC, { key: `${Object.values(TransactionDto)[0]}`, value: JSON.stringify(TransactionDto) })
        }
        return TransactionDto
    }
}
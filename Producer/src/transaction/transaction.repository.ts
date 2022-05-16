import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { TransactionDto } from "./dto/transaction.dto";
import 'dotenv/config';
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/entities/Account.entity";
import { getManager, Repository } from "typeorm";


@Injectable()
export class TransactionRepository {
    constructor(
        @Inject(process.env.KAFKA_NAME) private readonly client: ClientKafka,
        @InjectRepository(Account) private AccountRepository: Repository<Account>,
    ) { }

    async createTransaction(TransactionDto: TransactionDto[]) {
        return await this.produceTransaction(TransactionDto)
    }

    private async produceTransaction(TransactionDto: TransactionDto[]): Promise<any> {

        let rawData;
        const entityManager = getManager();

        if (TransactionDto.length != undefined && TransactionDto.length > 0) {
            for (let element of TransactionDto) {
                rawData = await entityManager.query(`Select * from hk_accounts where consumer_id=${parseInt(element.consumer_id)}`);
                if (rawData.length > 0) {
                    this.client.emit(process.env.KAFKA_TOPIC, { key: `${element.id}`, value: JSON.stringify(element) })
                }
            }
        } else {
            rawData = await entityManager.query(`Select * from hk_accounts where consumer_id=${parseInt(TransactionDto[0].consumer_id)}`);
            if (rawData.length > 0) {
                this.client.emit(process.env.KAFKA_TOPIC, { key: `${Object.values(TransactionDto)[0]}`, value: JSON.stringify(TransactionDto) })
            }
        }
        return TransactionDto
    }
}
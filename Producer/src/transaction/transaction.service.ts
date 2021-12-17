import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TransactionMapper } from '../helpers/mapper/transaction.mapper';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import 'dotenv/config';



@Injectable()
export class TransactionService implements OnModuleInit, OnModuleDestroy{
  constructor(
    @Inject(process.env.KAFKA_NAME) private readonly client: ClientKafka
    ) {}
    async onModuleInit() {
      ['transaction.Kafka'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));
      await this.client.connect();
    }
  
    async onModuleDestroy() {
      await this.client.close();
    }
    
  create(createTransactionDto) {
    let transactions = createTransactionDto
    const mapper = new TransactionMapper();
    
    let mapped_transaction = []
    let transactionLength = transactions.length ?? 1;
    
    for (let index = 0; index < transactionLength; index++) {
      const transaction = transactions[index] ?? transactions;
      mapped_transaction.push(mapper.mapRecord(transaction, 'test_bank'))
      this.client.emit('transactionTesting.Kafka', {key:mapped_transaction[index].id, value: mapped_transaction[index]});
    }
    // save
    return mapped_transaction;
  }


  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

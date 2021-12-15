import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ClientKafka } from '@nestjs/microservices';
import { AccountMapper } from 'src/helpers/mapper/account.mapper';

@Injectable()
export class AccountService implements OnModuleInit, OnModuleDestroy{
  constructor(
    @Inject('TransactionKafa') private readonly client: ClientKafka
    ) {}
    async onModuleInit() {
      ['account.Kafka'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));
      await this.client.connect();
    }
  
    async onModuleDestroy() {
      await this.client.close();
    }
  create(createAccountDto) {
    let Account = createAccountDto
    const mapper = new AccountMapper();
    
    let mapped_transaction = []
    for (let index = 0; index < Account.length; index++) {
      const transaction = Account[index];
      mapped_transaction.push(mapper.mapRecord(transaction, 'test_bank'))
      this.client.emit('account.Kafka', {key:mapped_transaction[index].id, value: mapped_transaction[index]});
    }
    // save
    return mapped_transaction;
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}

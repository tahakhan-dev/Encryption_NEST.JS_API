import { Injectable } from '@nestjs/common';
import { TransactionMapper } from '../helpers/mapper/transaction.mapper';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  create(createTransactionDto: CreateTransactionDto) {
    let transactions = createTransactionDto
    const mapper = new TransactionMapper();
    
    let mapped_transaction = []
    for (let index = 0; index < transactions.length; index++) {
      const transaction = transactions[index];
      mapped_transaction.push(mapper.mapRecord(transaction, 'test_bank'))
    }
    // save
    console.log(mapped_transaction)
    return 'This action adds a new transaction';
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

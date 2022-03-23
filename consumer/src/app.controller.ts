import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import 'dotenv/config';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { mcCodes } from './entities/mcc_codes.entity';
import { mccMapper } from './entities/mcc_mapper.entity';
import { unCategorizedTransactions } from './entities/unCategorizedTransactions.entity';
@Controller()
export class AppController {
  constructor(
    @InjectRepository(Category) private CategoryRepository: Repository<Category>,
    @InjectRepository(mcCodes) private mcCodesRepository: Repository<mcCodes>,
    @InjectRepository(mccMapper) private mccMapperRepository: Repository<mccMapper>,
    @InjectRepository(unCategorizedTransactions) private unCategorizedTransactionsRepository: Repository<unCategorizedTransactions>
  ) {
  }

  @MessagePattern('data-lake-categorization')
  async readTransactionMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    try {
      const originalMessage = context.getMessage();
      const payload = JSON.stringify(originalMessage.value);
      const parsePayload = JSON.parse(payload)
      let MccCategory, mccMaper, categorizetrx, uncategorizeTrx, uncategorizeTrxInstance

      mccMaper = await this.mccMapperRepository.findOne({ mccCode: parsePayload.mcc })
      if (mccMaper) {
        MccCategory = await this.CategoryRepository.findOne({ categoryId: mccMaper.categoryId })
        categorizetrx = this.CategorizeTransaction(parsePayload, MccCategory.name, MccCategory.categoryId)
        // console.log('=================================categorizetrx===========================');
        // console.log(categorizetrx);
        // console.log('=====================================categorizetrx===========================');
      } else {
        // MccCategory = await this.CategoryRepository.findOne({ categoryId: 625 })
        uncategorizeTrx = await this.unCategorizeTransaction(parsePayload)
        console.log('=====================uncategorizeTrx====================================');
        console.log(uncategorizeTrx);
        console.log('=====================uncategorizeTrx====================================');
        // uncategorizeTrxInstance = await this.unCategorizedTransactionsRepository.create(uncategorizeTrx);
        console.log('============================uncategorizeTrxInstance===============================');
        console.log(uncategorizeTrxInstance);
        console.log('============================uncategorizeTrxInstance===============================');

        await this.unCategorizedTransactionsRepository.save({transaction_id:22})
      }
      console.log('==========================MccCategory==================================');
      console.log(MccCategory);
      console.log('==========================MccCategory==================================');
      return payload;
    } catch (e) {
      console.log('========================e==============================');
      console.log(e);
      console.log('==========================e========================');
    }

  }

  private async CategorizeTransaction(TransactionDto: any, categoryName: string, categoryId: number) {
    return {
      voucher_id: +TransactionDto.id, //
      consumer_id: +TransactionDto.consumer_id,
      vch_type: TransactionDto.type ?? '',
      category_name: categoryName ?? '',
      account_name: TransactionDto.from_account_title ?? '',
      vch_amount: +TransactionDto.amount ?? 0,
      vch_date: TransactionDto.vch_date ?? '',
      vch_year: +TransactionDto.vchyear ?? 0,
      vch_month: +TransactionDto.month ?? 0,
      vch_week: +TransactionDto.vch_week ?? 0,
      vch_day: +TransactionDto.vchday ?? 0,
      vch_created_on: new Date(),
      vch_desc: TransactionDto.description ?? '',
      vch_active: TransactionDto.active ?? 1,
      vch_ref_no: TransactionDto.ref_no ?? '0',
      fc_amount: '0',
      fc_currency: null,
      fc_rate: null,
      travel_mode: 0,
      travel_model_place: null,
      vch_trx_place: null,
      tag: null,
      vch_currency: TransactionDto.vch_currency ?? 'PKR',
      event_name: null,
      event_id: 0,
      vch_updated_on: null,
      account_id: +TransactionDto.from_acccount_number ?? 0,
      category_id: +categoryId,
      vch_no: 0,
      use_case_title: TransactionDto.type ?? '',
      device_type: null,
      vch_image: null,
      vch_quarter: +TransactionDto.trx_quarter ?? 1,
      record_created_on: new Date(),
      is_system: 0,
    }
  }

  private async unCategorizeTransaction(TransactionDto: any) {
    console.log('=======================TransactionDto============================');
    console.log(TransactionDto);
    console.log('=======================TransactionDto============================');
    return {
      transaction_id: TransactionDto.id,
      consumer_id: +TransactionDto.consumer_id,
      amount: +TransactionDto.amount ?? 0,
      transaction_type: TransactionDto.type ?? null,
      currency: TransactionDto.vch_currency ?? 'PKR',
      mcc_code: TransactionDto.mcc,
      account_id_from: +TransactionDto.from_acccount_number ?? null,
      account_id_to: +TransactionDto.to_account_number ?? null,
      description: TransactionDto.description ?? null,
      is_debit: +TransactionDto.is_debit ?? 0,
      is_credit: +TransactionDto.is_credit ?? 0,
      running_balance: +TransactionDto.running_balance ?? 0,
      account_id_from_name: TransactionDto.from_account_title ?? null,
      account_id_to_name: TransactionDto.to_account_title ?? null,
      transaction_reference: TransactionDto.ref_no ?? 0,
      trx_month: +TransactionDto.month ?? 0,
      trx_year: +TransactionDto.vchyear ?? 0,
      trx_day: +TransactionDto.vchday ?? 0,
      trx_quarter: +TransactionDto.trx_quarter ?? 1,
      created_on: TransactionDto.created_on ?? new Date(),
      device_type: null,
      record_created_on: null
    }
  }

}
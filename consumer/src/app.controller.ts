

import { Controller, Logger } from '@nestjs/common';
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
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const axios = require('axios').default;


@Controller()
export class AppController {
  constructor(
    @InjectRepository(Category) private CategoryRepository: Repository<Category>,
    @InjectRepository(mcCodes) private mcCodesRepository: Repository<mcCodes>,
    @InjectRepository(mccMapper) private mccMapperRepository: Repository<mccMapper>,
    @InjectRepository(unCategorizedTransactions) private unCategorizedTransactionsRepository: Repository<unCategorizedTransactions>
  ) {
  }

  @MessagePattern(process.env.KAFKA_TOPIC)
  async readTransactionMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    try {
      const originalMessage = context.getMessage();
      const payload = JSON.stringify(originalMessage.value);
      const parsePayload = JSON.parse(payload)
      let MccCategory, mccMaper, categorizetrx, uncategorizeTrx, uncategorizeTrxInstance, consumerToken
      let VoucherArray = []

      consumerToken = await this.generateToken(parseInt(parsePayload.consumer_id))
      mccMaper = await this.mccMapperRepository.findOne({ mccCode: parsePayload.mcc })

      if (mccMaper) {
        MccCategory = await this.CategoryRepository.findOne({ categoryId: mccMaper.categoryId })
        categorizetrx = await this.CategorizeTransaction(parsePayload, MccCategory.name, MccCategory.categoryId)
        VoucherArray.push(categorizetrx)
        let transactionPayload = {
          consumer_id: parsePayload.consumer_id,
          device_type: "android",
          vouchers: JSON.stringify(VoucherArray)
        }
        let encryption = await this.encryptText(JSON.stringify(transactionPayload))
        let response = await this.postTransaction(encryption, consumerToken)
      } else {
        uncategorizeTrx = await this.unCategorizeTransaction(parsePayload)
        uncategorizeTrxInstance = await this.unCategorizedTransactionsRepository.create(uncategorizeTrx);
        await this.unCategorizedTransactionsRepository.save(uncategorizeTrxInstance)
      }
      return payload;
    } catch (error) {
      console.log('==========================error==============================');
      console.log(error);
      console.log('==========================error==============================');
      return error
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
      event_name: '',
      event_id: 0,
      vch_updated_on: null,
      account_id: +TransactionDto.from_acccount_number ?? 0,
      category_id: +categoryId,
      vch_no: 0,
      use_case_title: TransactionDto.type ?? '',
      device_type: 'android',
      vch_image: null,
      vch_quarter: +TransactionDto.trx_quarter ?? 1,
      record_created_on: new Date(),
      is_system: 0,
    }
  }

  private async unCategorizeTransaction(TransactionDto: any) {
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

  private async encryptText(payload: any, key: string = '34BC51A6046A624881701EFD17115CBA') {
    let ourIv = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x00];
    const iv = Buffer.from(ourIv);
    var encoded = await this.encode(new Buffer(payload));
    var cipher = await crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(false);
    var cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);
    return cipheredMsg.toString('base64');
  }

  private async encode(text: any) {
    var blockSize = 16;
    var textLength = text.length;
    var amountToPad = blockSize - (textLength % blockSize);
    var result = new Buffer(amountToPad);
    result.fill(amountToPad);
    return Buffer.concat([text, result]);
  }

  private async generateToken(consumerId: number) {
    return jwt.sign({ consumer_id: consumerId }, process.env.JWT_TOKEN_SECRET);
  }

  private async postTransaction(payload: any, token: string) {
    console.log('====================payload======================');
    console.log(payload);
    console.log('======================payload=======================');
    console.log('=====================token===========================');
    console.log(token);
    console.log('=====================token===========================');
    await axios({
      method: 'post',
      url: 'http://35.238.46.115:1452/transactions/save',
      headers: {
        'auth-token': '7513f48395fca348b20cc898dfb3c53ae563da38aaf9393345c449f5df1a4636',
        'auth-mac': 'leltqtjmdemgquqfqwln',
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': `bearer ${token}`,
        'version': '3.0.4'
      },
      params: {
        u: payload
      },
    }).then(function (response) {
      console.log(response);
    });
  }
}
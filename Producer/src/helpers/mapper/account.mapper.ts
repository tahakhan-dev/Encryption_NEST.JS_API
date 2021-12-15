import { BaseMapper } from './base.mapper';
import { TEST_BANK } from '../constants';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

// export class TestBankMapper {

//   @IsNumber() 
//   @IsNotEmpty()
//   id: number;

//   @IsString()
//   @IsNotEmpty()
//   type:string;

//   @IsNumber() 
//   @IsNotEmpty()
//   amount: number;

//   @IsString()
//   txn_currency:string="PKR";

//   @IsNumber()
//   @IsOptional()
//   mcc:number;

//   @IsNumber() 
//   @IsNotEmpty()
//   pop_code:number

//   @IsString()
//   @IsOptional()
//   description:string

//   @IsString()
//   @IsNotEmpty()
//   from_acccount_number:string;

//   @IsString()
//   @IsNotEmpty()
//   from_account_title:string;

//   @IsString()
//   @IsOptional()
//   to_account_number:string;

//   @IsString()
//   @IsOptional()
//   to_account_title:string;

//   @IsString()
//   @IsNotEmpty()
//   consumer_id:string;

//   @IsString()
//   @IsOptional()
//   nature:string;

//   @IsString()
//   @IsNotEmpty()
//   datetime:string;

//   @IsString()
//   @IsOptional()
//   ref_no:string;

//   @IsString()
//   @IsOptional()
//   source:string;

//   @IsNumber()
//   @IsNotEmpty()
//   running_balance:string;

//   @IsString()
//   @IsOptional()
//   fc_amount:string;

//   @IsString()
//   @IsOptional()
//   fc_currency:string;

//   @IsString()
//   @IsOptional()
//   fc_rate:string;

// }

export class AccountMapper implements BaseMapper {

  public mapRecord(record: any, deviceType: string): object {
    
    if (deviceType.toString().toLowerCase() === TEST_BANK) {
      return this.testBankMapper(record);
    }
  }

  testBankMapper(record: any): object {
    
    let mapper = {
      id: record.id,
      type: record.type,
      amount: record.amount,
      txn_currency: record.txn_currency != undefined ? record.txn_currency : 'PKR' ,
      mcc: record.mcc != undefined ? record.mcc : '',
      pop_code: record.pop_code,
      description: record.description != undefined ? record.description : '' ,
      from_acccount_number: record.from_acccount_number,
      from_account_title: record.from_account_title ,
      to_account_number: record.to_account_number != undefined ? record.to_account_number : '',
      to_account_title: record.to_account_title != undefined ? record.to_account_number : '',
      consumer_id: record.consumer_id,
      nature: record.nature != undefined ? record.nature : '',
      datetime: record.datetime,
      ref_no: record.ref_no != undefined ? record.ref_no : '',
      source: record.source != undefined ? record.source :'' ,
      running_balance: record.running_balance,
      fc_amount: record.fc_amount != undefined ? record.fc_amount : '' ,
      fc_currency: record.fc_currency != undefined ? record.fc_currency : '',
      fc_rate: record.fc_rate != undefined ? record.fc_rate : '' ,
      // fc_rate: (record.hasOwnProperty('travelmodelocation')) ? record.travelmodelocation : null,
    
    };

    for (var key of Object.keys(mapper)) {
      if(mapper[key] == undefined){
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: `${key} is required`,
        }, HttpStatus.FORBIDDEN);
      }
  }
  return mapper
  }
}

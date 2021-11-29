import { BaseMapper } from './base.mapper';
import { TEST_BANK } from '../constants';

export class TransactionMapper implements BaseMapper {

  public mapRecord(record: any, deviceType: string): object {
    if (deviceType.toString().toLowerCase() === TEST_BANK) {
      return this.testBankMapper(record);
    }
  }

  testBankMapper(record: any): object {
    return {
      id: record.id,
      type: record.type,
      amount: record.amount,
      txn_currency: record.txn_currency,
      mcc: record.mcc,
      pop_code: record.pop_code,
      description: record.description,
      from_acccount_number: record.from_acccount_number,
      from_account_title: record.from_account_title,
      to_account_number: record.to_account_number,
      to_account_title: record.to_account_title,
      consumer_id: record.consumer_id,
      nature: record.nature,
      datetime: record.datetime,
      ref_no: record.ref_no,
      source: record.source,
      running_balance: record.running_balance,
      fc_amount: record.fc_amount,
      fc_currency: record.fc_currency,
      fc_rate: record.fc_rate,
      // fc_rate: (record.hasOwnProperty('travelmodelocation')) ? record.travelmodelocation : null,
    
    };
  }
}

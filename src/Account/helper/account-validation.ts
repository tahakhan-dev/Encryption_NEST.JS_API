// import Joi from 'joi';
import { AccountDto } from '../dto/Account.dto';

// export async function validateAccount(account: any) {
//   const accountSchema = Joi.object({
//     account_id: Joi.number(),
//     consumer_id: Joi.number(),
//     account_type: Joi.string(),
//     active: Joi.number(),
//     balance_amount: Joi.number(),
//     description: Joi.string(),
//     title: Joi.string(),
//     opening_balance: Joi.number(),
//     is_synce: Joi.string(),
//     account_currency: Joi.string(),
//     bank_name: Joi.string(),
//     sys_defined: Joi.number(),
//     net_amount_total: Joi.number(),
//   });

//   const value = await accountSchema.validate(account);
//   // console.log(error);
//   console.log(value);
// }

export function validateAccount(accounts: AccountDto[]) {
  for (let account of accounts) {
    if (
      account.account_type != 'Bank' &&
      account.account_type != 'Cash' &&
      account.account_type != 'Savings' &&
      account.account_type != 'Person' &&
      account.account_type != 'Saving' &&
      account.account_type != 'Current'
    ) {
      return { error: 'Invalid Account Type or Is Empty', value: undefined };
    }
    if (account.active != 1) {
      return { error: 'Invalid Active Status', value: undefined };
    }
    if (account.description.length > 200) {
      return { error: 'Length of Description invalid', value: undefined };
    }
    if (account.title.length > 50 || account.title.length < 1) {
      return { error: 'Length of Title invalid', value: undefined };
    }
    if (account.bank_name.length > 50 || account.bank_name.length < 1) {
      return { error: 'Length of Bank Name invalid', value: undefined };
    }
    if (
      account.account_currency == null ||
      account.account_currency == 'null' ||
      account.account_currency == 'Null' ||
      account.account_currency == 'NULL' ||
      account.account_currency == ''
    ) {
      return { error: 'Invalid Account Currency or Is Empty', value: undefined };
    }
  }
  return { error: undefined, value: accounts };
}

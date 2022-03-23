import { IsNotEmpty } from 'class-validator';

export class TransactionDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    mcc: number;

    @IsNotEmpty()
    pop_code: number;

    @IsNotEmpty()
    from_acccount_number: string;

    @IsNotEmpty()
    from_account_title: string;

    @IsNotEmpty()
    to_account_number: string;

    @IsNotEmpty()
    to_account_title: string;

    @IsNotEmpty()
    consumer_id: string;

    @IsNotEmpty()
    nature: string;

    @IsNotEmpty()
    datetime: Date;

    @IsNotEmpty()
    ref_no: string;

    @IsNotEmpty()
    source: string;

    @IsNotEmpty()
    running_balance: number;

    @IsNotEmpty()
    active: number;

    @IsNotEmpty()
    created_on: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    vch_currency: string;

    @IsNotEmpty()
    vchday: number;

    @IsNotEmpty()
    vchyear: number;

    @IsNotEmpty()
    vch_date: number;

    @IsNotEmpty()
    vch_week: number;

    @IsNotEmpty()
    month: number;

    @IsNotEmpty()
    trx_quarter: number;
}

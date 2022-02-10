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
    fc_amount: string;

    @IsNotEmpty()
    fc_currency: string;

    @IsNotEmpty()
    fc_rate: string;
}

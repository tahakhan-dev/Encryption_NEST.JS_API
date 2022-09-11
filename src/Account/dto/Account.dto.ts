import { IsNotEmpty } from 'class-validator';

export class AccountDto {
    @IsNotEmpty()
    account_id: number;

    @IsNotEmpty()
    consumer_id: number;

    @IsNotEmpty()
    account_type: string;

    @IsNotEmpty()
    active: number;

    @IsNotEmpty()
    balance_amount: number;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    opening_balance: number;

    @IsNotEmpty()
    is_sync: string;

    @IsNotEmpty()
    account_currency: string;

    @IsNotEmpty()
    bank_name: string;

    @IsNotEmpty()
    sys_defined: number;

    @IsNotEmpty()
    net_amount_total: number;

}

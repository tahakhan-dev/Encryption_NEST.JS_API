import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('uncategorized_transactions')
export class unCategorizedTransactions {

    @PrimaryGeneratedColumn({name: 'id', type: 'bigint'})
    id: string;

    @Column({ name: 'transaction_id', type: 'bigint', nullable: true })
    transaction_id: number;

    @Column({ name: 'consumer_id', type: 'bigint', nullable: true })
    consumer_id: number;

    @Column({ name: 'amount', nullable: true })
    amount: number;

    @Column({ name: 'transaction_type', nullable: true })
    transaction_type: string;

    @Column({ name: 'currency', nullable: true })
    currency: string;

    @Column({ name: 'mcc_code', nullable: true })
    mcc_code: string;

    @Column({ name: 'account_id_from', type: 'bigint', nullable: true })
    account_id_from: number;

    @Column({ name: 'account_id_to', type: 'bigint', nullable: true })
    account_id_to: number;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ name: 'is_debit', nullable: true })
    is_debit: number;

    @Column({ name: 'is_credit', nullable: true })
    is_credit: number;

    @Column({ name: 'running_balance', nullable: true })
    running_balance: number;

    @Column({ name: 'account_id_from_name', nullable: true })
    accountIdFromName: string;

    @Column({ name: 'account_id_to_name', nullable: true })
    account_id_to_name: string;

    @Column({ name: 'transaction_reference', nullable: true })
    transaction_reference: string;

    @Column({ name: 'trx_month', nullable: true })
    trx_month: number;

    @Column({ name: 'trx_year', nullable: true })
    trx_year: number;

    @Column({ name: 'trx_day', nullable: true })
    trx_day: number;

    @Column({ name: 'trx_quarter', nullable: true })
    trx_quarter: number;

    @Column({ name: 'created_on', nullable: true })
    created_on: Date;

    @Column({ name: 'device_type', nullable: true })
    device_type: string;

    @Column({ name: 'record_created_on', nullable: true })
    record_created_on: Date;
}




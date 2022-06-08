import { Inject, Injectable, Logger } from "@nestjs/common";
import { TransactionDto } from "./dto/transaction.dto";
import 'dotenv/config';
import { InjectRepository } from "@nestjs/typeorm";
import { Accountss } from "src/entities/Account.entity";
import { getManager, Repository } from "typeorm";
import { Category } from "src/entities/category.entity";
import { mcCodes } from "src/entities/mcc_codes.entity";
import { mccMapper } from "src/entities/mcc_mapper.entity";
import { unCategorizedTransactions } from "src/entities/unCategorizedTransactions.entity";
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const axios = require('axios').default;

@Injectable()
export class TransactionRepository {
    constructor(
        @InjectRepository(Accountss) private AccountRepository: Repository<Accountss>,
        @InjectRepository(Category) private CategoryRepository: Repository<Category>,
        @InjectRepository(mcCodes) private mcCodesRepository: Repository<mcCodes>,
        @InjectRepository(mccMapper) private mccMapperRepository: Repository<mccMapper>,
        @InjectRepository(unCategorizedTransactions) private unCategorizedTransactionsRepository: Repository<unCategorizedTransactions>
    ) { }

    async createTransaction(TransactionDto: TransactionDto[]) {
        return await this.produceTransaction(TransactionDto)
    }

    private async produceTransaction(TransactionDto: TransactionDto[]): Promise<any> {

        let rawData;
        let MccCategory, mccMaper, categorizetrx, uncategorizeTrx, uncategorize, uncategorizeTrxInstance, response, consumerToken, transactionPayload, encryption
        let VoucherArray = []
        const entityManager = getManager();

        if (TransactionDto.length != undefined && TransactionDto.length > 0) {
            for (let element of TransactionDto) {
                rawData = await entityManager.query(`Select * from hk_accounts where consumer_id=${parseInt(element.consumer_id)}`);
                if (rawData.length > 0) {

                    consumerToken = await this.generateToken(parseInt(element.consumer_id))
                    mccMaper = await this.mccMapperRepository.findOne({ mccCode: element.mcc })

                    if (mccMaper) {

                        MccCategory = await this.CategoryRepository.findOne({ categoryId: mccMaper.categoryId })
                        categorizetrx = await this.CategorizeTransaction(element, MccCategory.name, MccCategory.categoryId)

                        VoucherArray.push(categorizetrx)

                        transactionPayload = {
                            consumer_id: element.consumer_id,
                            device_type: "android",
                            vouchers: JSON.stringify(VoucherArray)
                        }
                        encryption = await this.encryptText(JSON.stringify(transactionPayload))
                        response = await this.postTransaction(encryption, consumerToken)

                    } else {

                        const entityManager = getManager();
                        const rawData = await entityManager.query(`select * from uncategorized_transactions where consumer_id = ${parseInt(element.consumer_id)} and transaction_id = ${element.id}`);
                        if (rawData.length == 0) {
                            uncategorizeTrx = await this.unCategorizeTransaction(element)
                            uncategorizeTrxInstance = await this.unCategorizedTransactionsRepository.create(uncategorizeTrx);
                            uncategorize = await this.unCategorizedTransactionsRepository.save(uncategorizeTrx)
                        }

                    }
                }
            }
            return true;
        } else {
            rawData = await entityManager.query(`Select * from hk_accounts where consumer_id=${parseInt(TransactionDto[0].consumer_id)}`);
            if (rawData.length > 0) {
                consumerToken = await this.generateToken(parseInt(TransactionDto[0].consumer_id))
                mccMaper = await this.mccMapperRepository.findOne({ mccCode: TransactionDto[0].mcc })

                if (mccMaper) {

                    MccCategory = await this.CategoryRepository.findOne({ categoryId: mccMaper.categoryId })
                    categorizetrx = await this.CategorizeTransaction(TransactionDto[0], MccCategory.name, MccCategory.categoryId)

                    VoucherArray.push(categorizetrx)

                    transactionPayload = {
                        consumer_id: TransactionDto[0].consumer_id,
                        device_type: "android",
                        vouchers: JSON.stringify(VoucherArray)
                    }
                    encryption = await this.encryptText(JSON.stringify(transactionPayload))
                    response = await this.postTransaction(encryption, consumerToken)

                } else {

                    const entityManager = getManager();
                    const rawData = await entityManager.query(`select * from uncategorized_transactions where consumer_id = ${parseInt(TransactionDto[0].consumer_id)} and transaction_id = ${TransactionDto[0].id}`);
                    if (rawData.length == 0) {
                        uncategorizeTrx = await this.unCategorizeTransaction(TransactionDto[0])
                        uncategorizeTrxInstance = await this.unCategorizedTransactionsRepository.create(uncategorizeTrx);
                        uncategorize = await this.unCategorizedTransactionsRepository.save(uncategorizeTrx)
                    }

                }
                return true;
            }
        }
        return TransactionDto
    }

    private async CategorizeTransaction(TransactionDto: any, categoryName: string, categoryId: number) {
        return {
            voucher_id: +TransactionDto.id, //
            consumer_id: +TransactionDto.consumer_id,
            vchType: TransactionDto.type ?? '',
            categoryName: categoryName ?? '',
            accountName: TransactionDto.from_account_title ?? '',
            vchAmount: +TransactionDto.amount ?? 0,
            vchDate: TransactionDto.vch_date ?? '',
            vchYear: +TransactionDto.vchyear ?? 0,
            month: +TransactionDto.month ?? 0,
            vch_week: +TransactionDto.vch_week ?? 0,
            vchDay: +TransactionDto.vchday ?? 0,
            created_on: new Date(),
            vchDescription: TransactionDto.description ?? '',
            active: TransactionDto.active ?? 1,
            voucherReference: TransactionDto.ref_no ?? '0',
            fcAmount: '0',
            fc_currency: null,
            fc_rate: null,
            travelMode: 0,
            travel_model_place: null,
            vch_trx_place: null,
            tag: null,
            vchCurrency: TransactionDto.vch_currency ?? 'PKR',
            event_name: '',
            eventId: 0,
            vch_updated_on: null,
            accountId: +TransactionDto.from_acccount_number ?? 0,
            categoryId: +categoryId,
            vch_no: 0,
            useCase: TransactionDto.type ?? '',
            device_type: 'android',
            vchImage: null,
            vch_quarter: +TransactionDto.trx_quarter ?? 1,
            record_created_on: new Date(),
            isSystemTransaction: 0,
            no_serial: 0,
            party_id: 0,
            sync: 0,
            userId: 0
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
            transaction_reference: TransactionDto.ref_no ?? 1,
            trx_month: +TransactionDto.month ?? 0,
            trx_year: +TransactionDto.vchyear ?? 0,
            trx_day: +TransactionDto.vchday ?? 0,
            trx_quarter: +TransactionDto.trx_quarter ?? 1,
            created_on: TransactionDto.created_on ?? new Date(),
            device_type: null,
            record_created_on: null
        }
    }

    private async encryptText(payload: any, key: string = process.env.ENCRYPT_KEY) {
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
        await axios({
            method: 'post',
            url: process.env.TRANSACTION_URL,
            headers: {
                'auth-token': process.env.AUTH_TOKEN,
                'auth-mac': process.env.AUTH_MAC,
                'Content-Type': process.env.CONTENT_TYPE,
                'authorization': `bearer ${token}`,
                'version': process.env.VERSION
            },
            params: {
                u: payload
            },
        })
    }
}
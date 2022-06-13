import { Inject, Injectable, Logger } from "@nestjs/common";
import { AccountDto } from "./dto/Account.dto";
import 'dotenv/config';
import { InjectRepository } from "@nestjs/typeorm";
import { Accountss } from "src/entities/Account.entity";
import { getManager, Repository } from "typeorm";
var crypto = require('crypto');
const jwt = require('jsonwebtoken');


@Injectable()
export class AccountRepository {
    constructor(
        @InjectRepository(Accountss) private AccountRepo: Repository<Accountss>,
    ) { }

    async createAccount(AccountDto: AccountDto[]) {
        return await this.produceAccount(AccountDto)
    }

    private async produceAccount(AccountDto: AccountDto[]): Promise<any> {
        try {
            if (AccountDto.length != undefined && AccountDto.length > 0) {
                for (let element of AccountDto) {

                    const entityManager = getManager();
                    let mapper, mapperInstance, response
                    mapper = this.accountMapper(element)

                    const rawData = await entityManager.query(`Select * from hk_accounts where account_id=${parseInt(mapper.account_id)} and consumer_id=${parseInt(mapper.consumer_id)}`);

                    if (rawData.length == 1) {
                        await entityManager.query(`UPDATE hk_accounts SET account_nature=${mapper.account_nature},account_type='${mapper.account_type}',active=${mapper.active},balance_amount=${mapper.balance_amount},box_color='${mapper.box_color}',box_icon='${mapper.box_icon}',description='${mapper.description}',flex1=${mapper.flex1},flex2=${mapper.flex2},flex3=${mapper.flex3},flex4=${mapper.flex4},flex5=${mapper.flex5},flex6=${mapper.flex6},gl_account_no=${mapper.gl_account_no},title='${mapper.title}',opening_balance='${mapper.opening_balance}',is_sync='${mapper.is_sync}',device_type='${mapper.device_type}',account_currency='${mapper.account_currency}',bank_name='${mapper.bank_name}',sys_defined=${mapper.sys_defined},net_amount_total=${mapper.net_amount_total} where account_id=${parseInt(mapper.account_id)} and consumer_id=${parseInt(mapper.consumer_id)}`);
                    } else {
                        mapperInstance = await this.AccountRepo.create(mapper)
                        response = await this.AccountRepo.save(mapper)
                    }
                }
            } else {

                const entityManager = getManager();
                let mapper, mapperInstance, response
                mapper = this.accountMapper(AccountDto)

                const rawData = await entityManager.query(`Select * from hk_accounts where account_id=${parseInt(mapper.account_id)} and consumer_id=${parseInt(mapper.consumer_id)}`);
                if (rawData.length == 1) {
                    await entityManager.query(`UPDATE hk_accounts SET account_nature=${mapper.account_nature},account_type='${mapper.account_type}',active=${mapper.active},balance_amount=${mapper.balance_amount},box_color='${mapper.box_color}',box_icon='${mapper.box_icon}',description='${mapper.description}',flex1=${mapper.flex1},flex2=${mapper.flex2},flex3=${mapper.flex3},flex4=${mapper.flex4},flex5=${mapper.flex5},flex6=${mapper.flex6},gl_account_no=${mapper.gl_account_no},title='${mapper.title}',opening_balance='${mapper.opening_balance}',is_sync='${mapper.is_sync}',device_type='${mapper.device_type}',account_currency='${mapper.account_currency}',bank_name='${mapper.bank_name}',sys_defined=${mapper.sys_defined},net_amount_total=${mapper.net_amount_total} where account_id=${parseInt(mapper.account_id)} and consumer_id=${parseInt(mapper.consumer_id)}`);
                } else {
                    mapperInstance = await this.AccountRepo.create(mapper)
                    response = await this.AccountRepo.save(mapper)
                }
            }
            return { isAccount: true }
        } catch (error) {
            return error
        }

    }

    private accountMapper(AccountDto: any) {
        return {
            account_id: parseInt(AccountDto.account_id),
            consumer_id: parseInt(AccountDto.consumer_id),
            account_nature: null,
            account_type: AccountDto.account_type ?? null,
            active: AccountDto.active ?? 1,
            balance_amount: 0.0000,
            box_color: AccountDto.box_color ?? null,
            box_icon: AccountDto.box_icon ?? null,
            description: AccountDto.description ?? null,
            flex1: null,
            flex2: null,
            flex3: null,
            flex4: null,
            flex5: null,
            flex6: null,
            gl_account_no: null,
            title: AccountDto.title ?? null,
            opening_balance: AccountDto.opening_balance ?? 0.0000,
            record_created_on: new Date(),
            is_sync: AccountDto.is_sync ?? 1,
            device_type: 'Andriod',
            account_currency: AccountDto.account_currency ?? 'PKR',
            bank_name: AccountDto.bank_name ?? null,
            sys_defined: AccountDto.sys_defined ?? 1,
            net_amount_total: AccountDto.net_amount_total ?? 0.0000
        }
    }

    public async decryptText(payload: any, key: string) {
        
        let ourIv = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x00];
        const iv = Buffer.from(ourIv);

        var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        decipher.setAutoPadding(false);

        var deciphered = Buffer.concat([decipher.update(payload, 'base64'), decipher.final()]);
        
        deciphered = this.decode(deciphered);
        
        return deciphered.toString();
    }

    private decode(text: any) {
        var pad = text[text.length - 1];

        if (pad < 1 || pad > 16) {
            pad = 0;
        }

        return text.slice(0, text.length - pad);
    }

    public async verifyToken(token: string, cb){
        return jwt.verify(token, process.env.JWT_TOKEN_SECRET, {}, cb);
    }

}
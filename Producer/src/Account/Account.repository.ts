import { Inject, Injectable, Logger } from "@nestjs/common";
import { AccountDto } from "./dto/Account.dto";
import 'dotenv/config';
import { InjectRepository } from "@nestjs/typeorm";
import { Accountss } from "src/entities/Account.entity";
import { getManager, Repository } from "typeorm";
import { accountMapper } from "./helper/accountMapper";

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
                    mapper = accountMapper(element)

                    const rawData = await entityManager.query(`Select * from hk_accounts where account_id=${parseInt(mapper.account_id)} and consumer_id=${parseInt(mapper.consumer_id)}`);

                    if (rawData.length == 1) {
                        await entityManager.query(`UPDATE hk_accounts SET account_nature=${mapper.account_nature},account_type='${mapper.account_type}',active=${mapper.active},balance_amount=${mapper.balance_amount},box_color='${mapper.box_color}',box_icon='${mapper.box_icon}',description='${mapper.description}',flex1=${mapper.flex1},flex2=${mapper.flex2},flex3=${mapper.flex3},flex4=${mapper.flex4},flex5=${mapper.flex5},flex6=${mapper.flex6},gl_account_no=${mapper.gl_account_no},title='${mapper.title}',opening_balance='${mapper.opening_balance}',is_sync='${mapper.is_sync}',device_type='${mapper.device_type}',bank_name='${mapper.bank_name}',sys_defined=${mapper.sys_defined},net_amount_total=${mapper.net_amount_total} where account_id=${parseInt(mapper.account_id)} and consumer_id=${parseInt(mapper.consumer_id)}`);
                    } else {
                        mapperInstance = await this.AccountRepo.create(mapper)
                        response = await this.AccountRepo.save(mapper)
                    }
                }
            } else {
                const entityManager = getManager();
                let mapper, mapperInstance, response
                mapper = accountMapper(AccountDto)

                const rawData = await entityManager.query(`Select * from hk_accounts where account_id=${parseInt(mapper.account_id)} and consumer_id=${parseInt(mapper.consumer_id)}`);
                if (rawData.length == 1) {
                    await entityManager.query(`UPDATE hk_accounts SET account_nature=${mapper.account_nature},account_type='${mapper.account_type}',active=${mapper.active},balance_amount=${mapper.balance_amount},box_color='${mapper.box_color}',box_icon='${mapper.box_icon}',description='${mapper.description}',flex1=${mapper.flex1},flex2=${mapper.flex2},flex3=${mapper.flex3},flex4=${mapper.flex4},flex5=${mapper.flex5},flex6=${mapper.flex6},gl_account_no=${mapper.gl_account_no},title='${mapper.title}',opening_balance='${mapper.opening_balance}',is_sync='${mapper.is_sync}',device_type='${mapper.device_type}',bank_name='${mapper.bank_name}',sys_defined=${mapper.sys_defined},net_amount_total=${mapper.net_amount_total} where account_id=${parseInt(mapper.account_id)} and consumer_id=${parseInt(mapper.consumer_id)}`);
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

   

}
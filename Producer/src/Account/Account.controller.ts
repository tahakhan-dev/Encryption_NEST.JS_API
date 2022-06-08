import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AccountDto } from './dto/Account.dto';
import { AccountService } from './Account.service';
import { ResponseWrapper } from 'src/common/enums/response-wrapper';
import { StatusCodes } from '../common/enums/status-codes';

@Controller('Account')
export class AccountController {
    constructor(
        private readonly service: AccountService,
    ) { }

    @Post('/create')
    async createAccount(@Body() AccountDto: AccountDto[]): Promise<any> {
        var response = new ResponseWrapper<any>();
        try {
            // let decryptDto = await this.repo.decryptText(AccountDto.u, "34BC51A6046A624881701EFD17115CBA")
            // let data = await this.service.CreateAccountServiceHandler(JSON.parse(decryptDto));
            let data = await this.service.CreateAccountServiceHandler(AccountDto);
            response.StatusCode = StatusCodes.Success;
            response.Result = data;
            response.Message = 'Account Produce In kafka'
        } catch (error) {
            response.Result = null;
            response.StatusCode = StatusCodes.Exception;
            response.Message = error.response.error;
        }
        return response;
    }
}
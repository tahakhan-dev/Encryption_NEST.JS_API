import { Controller, Post, Body, Get, Query, Req, HttpStatus, Res } from '@nestjs/common';
import { AccountDto } from './dto/Account.dto';
import { AccountService } from './Account.service';
import { ResponseWrapper } from 'src/common/enums/response-wrapper';
import { StatusCodes } from '../common/enums/status-codes';
import { Response } from 'express';
import { AccountRepository } from './Account.repository';

@Controller('Account')
export class AccountController {
    constructor(
        private readonly service: AccountService,
        private readonly repo: AccountRepository
    ) { }

    @Post('/create')
    async createAccount(@Body() AccountDto, @Res() response: Response): Promise<any> {
        try {

            let decryptDto = await this.repo.decryptText(AccountDto.u, "34BC51A6046A624881701EFD17115CBA")
            let data = await this.service.CreateAccountServiceHandler(JSON.parse(decryptDto).account);

            response
                .status(data.isAccount == true ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    StatusCode: data.isAccount == true ? StatusCodes.Success : StatusCodes.Exception,
                    Result: data.isAccount == true ? [] : null,
                    Message: data.isAccount == true ? 'Account Created' : data.message
                })
        } catch (error) {
            response
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    StatusCode: StatusCodes.Exception,
                    Result: null,
                    Message: error.response.error
                })
        }
        return response;
    }
}
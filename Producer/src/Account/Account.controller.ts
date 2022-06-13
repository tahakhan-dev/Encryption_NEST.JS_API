import { Controller, Post, Body, Get, Query, Req, Header, Headers, HttpStatus, Res, HttpException } from '@nestjs/common';
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
    @Header("Content-Type", "application/x-www-form-urlencoded")
    async createAccount(@Body() AccountDto, @Res() response: Response, @Headers() headers): Promise<any> {
        try {

            let bearer_token = headers.authorization;
            console.log('=================bearer_token==================');
            console.log(bearer_token);
            console.log('=================bearer_token==================');

            bearer_token = bearer_token.split(" ");
            if (!(bearer_token[0].toLowerCase() === "bearer" && bearer_token[1])) {
                // no auth token or invalid token!
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'Token is Invalid',
                }, HttpStatus.FORBIDDEN);



            }
            let isUserVerified = await this.repo.verifyToken(bearer_token[1], function (err, data) {
                if (err) {
                    console.log('==============verify Token error=======================');
                    console.log(err);
                    console.log('==============verify Token error=======================');

                    throw new HttpException({
                        status: HttpStatus.FORBIDDEN,
                        error: 'Token is Invalid',
                    }, HttpStatus.FORBIDDEN);
                } else {
                    return data
                }
            });

            console.log(isUserVerified.consumer_id);
            console.log('===========req.body=====================');
            console.log(AccountDto);
            console.log('===========req.body=====================');

            let decryptDto = await this.repo.decryptText(AccountDto.u, "34BC51A6046A624881701EFD17115CBA")
            let accountDecrypt = JSON.parse(decryptDto).accounts_array;

            console.log(typeof accountDecrypt);




            if (JSON.parse(accountDecrypt) === null) {
                console.log('if=-===== account=======');

                throw new HttpException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    error: 'There is not account to process',
                }, HttpStatus.UNPROCESSABLE_ENTITY);
            }

            console.log('===========accountDecrypt================');
            console.log(accountDecrypt);
            console.log('===========accountDecrypt================');


            for (let element of JSON.parse(accountDecrypt)) {
                console.log('======for');

                console.log(element.consumer_id);
                console.log(isUserVerified.consumer_id);


                if (parseInt(element.consumer_id) !== parseInt(isUserVerified.consumer_id)) {
                    throw new HttpException({
                        status: HttpStatus.FORBIDDEN,
                        error: 'Token is Invalid or its belong to somenone else',
                    }, HttpStatus.FORBIDDEN);
                }
            }

            let data = await this.service.CreateAccountServiceHandler(accountDecrypt);

            response
                .status(data.isAccount == true ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    StatusCode: data.isAccount == true ? StatusCodes.Success : StatusCodes.Exception,
                    Result: data.isAccount == true ? [] : null,
                    Message: data.isAccount == true ? 'Account Created' : data.message
                })
        } catch (error) {
            console.log('=================error==================');
            console.log(error);
            console.log('=================error==================');

            response
                .status(error ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    StatusCode: error ? error.status : StatusCodes.Exception,
                    Result: null,
                    Message: error.response.error
                })
        }
        return response;
    }
}
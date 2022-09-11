import {
  Controller,
  Post,
  Req,
  Header,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AccountService } from './Account.service';
import { StatusCodes } from '../common/enums/status-codes';
import { Response,Request } from 'express';

@Controller('Account')
export class AccountController {
  constructor(
    private readonly service: AccountService,
  ) {}

  @Post('/create')
  @Header('Content-Type', 'application/x-www-form-urlencoded')
  async createAccount(@Res() response: Response,@Req() req: Request): Promise<any> {
    try {
      let data = await this.service.CreateAccountServiceHandler(req.decryptText);

      response.status(data.isAccount == true ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          StatusCode: data.isAccount == true ? StatusCodes.Success : StatusCodes.Exception,
          Result: data.isAccount == true ? [] : null,
          Message: data.isAccount == true ? 'Account Created' : data.message,
        });
    } catch (error) {
      console.log('=================error==================');
      console.log(error);
      console.log('=================error==================');

      response
        .status(error ? error.status : HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          StatusCode: error ? error.status : StatusCodes.Exception,
          Result: null,
          Message: error.response.error,
        });
    }
    return response;
  }
}

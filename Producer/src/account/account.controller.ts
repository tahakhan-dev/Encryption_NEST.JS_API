import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { StatusCodes } from '../common/enums/status-codes';
import { ResponseWrapper } from 'src/common/enums/response-wrapper';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/create')
  createAccount(@Body() createAccountDto) {
    var response = new ResponseWrapper<any>();
    try{
      let data =  this.accountService.create(createAccountDto)
      response.StatusCode =  StatusCodes.Success;      
      response.Result = data;
      response.Message = 'Success'
    }catch(error){
      response.Result = null;
      response.StatusCode =  error.response.status;
      response.Message = error.response.error;      
    }
    return response;
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}

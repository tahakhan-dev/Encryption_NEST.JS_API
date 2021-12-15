import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus  } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { StatusCodes } from '../common/enums/status-codes';
import { ResponseWrapper } from 'src/common/enums/response-wrapper';


@Controller('transaction')
export class TransactionController   {
  constructor(
    private readonly transactionService: TransactionService
    ) {}

  @Post('/create')
  createTransaction(@Body() createTransactionDto){
    var response = new ResponseWrapper<any>();
    try{
      let data =  this.transactionService.create(createTransactionDto)
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
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}

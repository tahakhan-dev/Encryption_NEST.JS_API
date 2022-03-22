import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';
import { ResponseWrapper } from 'src/common/enums/response-wrapper';
import { StatusCodes } from '../common/enums/status-codes';

@Controller('Transaction')
export class TransactionController {
    constructor(
        private readonly service: TransactionService,
    ) { }

    @Post('/create')
    async createTransaction(@Body() TransactionDto: TransactionDto[]): Promise<any> {
        var response = new ResponseWrapper<any>();
        try {
            let data = await this.service.CreateTransactionServiceHandler(TransactionDto);
            response.StatusCode = StatusCodes.Success;
            response.Result = data;
            response.Message = 'Transaction Produce In kafka'
        } catch (error) {
            response.Result = null;
            response.StatusCode = error.response.status;
            response.Message = error.response.error;
        }
        return response;
    }
}
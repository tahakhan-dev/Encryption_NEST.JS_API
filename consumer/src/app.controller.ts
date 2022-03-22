import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import 'dotenv/config';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { mcCodes } from './entities/mcc_codes.entity';
import { mccMapper } from './entities/mcc_mapper.entity';
@Controller()
export class AppController {
  constructor(
    @InjectRepository(Category) private CategoryRepository: Repository<Category>,
    @InjectRepository(mcCodes) private mcCodesRepository: Repository<mcCodes>,
    @InjectRepository(mccMapper) private mccMapperRepository: Repository<mccMapper>
  ) {
  }

  @MessagePattern('data-lake-categorization')
  async readTransactionMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const payload = JSON.stringify(originalMessage.value);
    const parsePayload = JSON.parse(payload)
    let MccCategory
    console.log(parsePayload);
    console.log(parsePayload.id);

    let mccMaper = await this.mccMapperRepository.findOne({ mccCode: parsePayload.mcc })
    console.log('===========================mccMaper===============================');
    console.log(mccMaper);
    console.log('===========================mccMaper===============================');
    if (mccMaper) {
      MccCategory = await this.CategoryRepository.findOne({ categoryId: mccMaper.categoryId })
    } else {
      MccCategory = await this.CategoryRepository.findOne({ categoryId: 625 })
    }
    console.log('==========================MccCategory==================================');
    console.log(MccCategory);
    console.log('==========================MccCategory==================================');
    return payload;
  }

  // @MessagePattern('testing123')
  // readAccountMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
  //   const originalMessage = context.getMessage();
  //   const response =
  //     `Receiving a new message from topic: wipe-data: ` +
  //     JSON.stringify(originalMessage.value);
  //   console.log(response);
  //   return response;
  // }
}
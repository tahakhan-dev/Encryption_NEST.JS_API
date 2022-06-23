import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validateAccount } from 'src/Account/helper/account-validation';
import { decryptText } from 'src/common/decryptText';

declare global {
    namespace Express {
      interface Request {
        decryptText? :any;
      }
    }
  }


@Injectable()
export class DecryptUserMiddleware implements NestMiddleware {
  constructor(
    ) {}

  async use(req: Request, res: Response, next: NextFunction) {

    let decryptDto = await decryptText(
        req.body.u,
        '34BC51A6046A624881701EFD17115CBA',
      );
      let converStringify = JSON.parse(decryptDto).accounts_array;
      let accountDecrypt = JSON.parse(converStringify);

      if (accountDecrypt == null || accountDecrypt == 'null') {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'There is not account to process',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const validationResult = await validateAccount(accountDecrypt);
      if (validationResult.error != undefined) {
        res.statusCode = 400;
        res.send({ message: validationResult.error });
        return res;
      }

      for (let element of accountDecrypt) {
        if (
          parseInt(element.consumer_id) !== parseInt(req.consumerId)
        ) {
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'Token is Invalid or its belong to somenone else',
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }

      req.decryptText = accountDecrypt

    next();
  }
}
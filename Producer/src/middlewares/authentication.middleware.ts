import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from 'src/common/verifyToken';

declare global {
  namespace Express {
    interface Request {
      consumerId? : any;
    }
  }
}

@Injectable()
export class AuthenticationUserMiddleware implements NestMiddleware {
  constructor(
    ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let {authorization} = req.headers

      const bearer_token = authorization.split(' ');
      
      if (!(bearer_token[0].toLowerCase() === 'bearer' && bearer_token[1])) {
        // no auth token or invalid token!
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Token is Invalid',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      let isUserVerified = await verifyToken(
        bearer_token[1],
        function (err, data) {
          console.log(data);
          
          if (err) {
            throw new HttpException(
              {
                status: HttpStatus.FORBIDDEN,
                error: 'Token is Expired',
              },
              HttpStatus.FORBIDDEN,
            );
          } else {
            return data;
          }
        },
      );

    req.consumerId = isUserVerified.consumer_id

    next();
  }
}

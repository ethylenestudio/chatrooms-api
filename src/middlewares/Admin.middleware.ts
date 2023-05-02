import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;
        console.log('admin middleware');

        //todo: require authorization signature to retrieve admin pubkey
        next();
    }
}

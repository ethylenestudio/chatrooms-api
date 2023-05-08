import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ManagerCreateMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;
        console.log('manager creator middleware');

        //todo creator must be the admin of the organization
        next();
    }
}

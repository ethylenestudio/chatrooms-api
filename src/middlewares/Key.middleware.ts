import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class KeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    console.log('key middleware');

    //todo: incoming key.sessionId => session.organizationId should match sender.organizationId OR sender should be admin
    next();
  }
}

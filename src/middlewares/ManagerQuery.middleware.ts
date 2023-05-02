import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ManagerQueryMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    console.log('manager middleware');
    console.log(req.query);

    //todo: requested organization => session.organizationId should match sender.organizationId OR sender should be admin
    next();
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { verificationMessage } from 'config';
import { ethers } from 'ethers';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from 'src/errors/errors';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;
        if (!authorization) {
            BadRequest('Provide signature!');
        }
        try {
            const verification = ethers.utils.verifyMessage(
                verificationMessage,
                authorization,
            );
        } catch (e) {
            BadRequest('You are not authorized to access this route');
        }

        //todo: require authorization signature to retrieve admin pubkey
        next();
    }
}

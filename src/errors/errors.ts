import { HttpException, HttpStatus } from '@nestjs/common';

export function BadRequest(message: string = 'Bad Request!') {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
}

export function UnAuthorized(message: string = 'Unauthorized Request!') {
    throw new HttpException(message, HttpStatus.UNAUTHORIZED);
}

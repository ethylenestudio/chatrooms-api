import { HttpException, HttpStatus } from '@nestjs/common';

export function BadRequest(message = 'Bad Request!') {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
}

export function UnAuthorized(message = 'Unauthorized Request!') {
    throw new HttpException(message, HttpStatus.UNAUTHORIZED);
}

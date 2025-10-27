import { HttpException, HttpStatus } from '@nestjs/common';

import { ResponseCodes } from './response-codes';
import { ErrorCode } from './erros-codes';

export class AppError extends HttpException {
  constructor(code: ErrorCode, message?: string, status?: HttpStatus) {
    const responseCode = ResponseCodes[code];
    super(
      {
        status: responseCode?.status || 'FAILED',
        code: responseCode?.code || code,
        message: message || responseCode?.message || 'An error occurred',
      },
      status || HttpStatus.BAD_REQUEST,
    );
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from 'src/common/dtos/error-response';

@Catch()
export class GoogleApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isApiKeyIssue = this.isApiKeyException(exception);

    const errorMessage = isApiKeyIssue
      ? 'Missing or invalid access token.'
      : 'An unexpected error occurred.';

    const errorResponse: ErrorResponse = {
      statusCode: isApiKeyIssue ? HttpStatus.UNAUTHORIZED : status,
      error: isApiKeyIssue ? 'Unauthorized' : exception.name || 'Error',
      message: errorMessage,
    };

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private isApiKeyException(exception: HttpException): boolean {
    return exception.message.includes('API key');
  }
}

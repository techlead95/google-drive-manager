import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../common/dtos/error-response';

export function GoogleDriveResponses() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized: Missing or invalid API key.',
      type: ErrorResponse,
    }),
  );
}

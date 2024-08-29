import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/dtos/error-response';

export function GoogleDriveResponses() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized: Missing or invalid API key.',
      type: ErrorResponse,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error: An unexpected error occurred.',
      type: ErrorResponse,
    }),
  );
}

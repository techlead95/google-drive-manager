import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;
}

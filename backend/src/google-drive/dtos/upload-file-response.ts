import { ApiProperty } from '@nestjs/swagger';

export default class UploadFileResponse {
  @ApiProperty({
    description: 'The ID of uploaded file',
  })
  id: string;

  @ApiProperty({
    description: 'The name of uploaded file',
  })
  name: string;
}

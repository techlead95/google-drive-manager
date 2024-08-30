import { ApiProperty } from '@nestjs/swagger';

class File {
  @ApiProperty({
    description: 'The ID of the file',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the file',
  })
  name: string;

  @ApiProperty({
    description: 'The MIME type of the file',
  })
  mimeType: string;

  @ApiProperty({
    description: 'The time the file was last modified',
  })
  modifiedTime: string;
}

export default class GetFilesResponse {
  @ApiProperty({
    type: [File],
    description: 'Array of files',
  })
  files: File[];

  @ApiProperty({
    description: 'Token for the next page, if available',
    required: false,
  })
  nextPageToken?: string;
}

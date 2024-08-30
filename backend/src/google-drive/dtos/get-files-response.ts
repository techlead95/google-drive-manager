import { ApiProperty } from '@nestjs/swagger';

class GetFilesResponseItem {
  @ApiProperty({
    description: 'The ID of the file',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the file',
  })
  name: string;

  @ApiProperty({
    description: 'The time the file was last modified',
  })
  modifiedTime: string;
}

export default class GetFilesResponse {
  @ApiProperty({
    type: [GetFilesResponseItem],
    description: 'Array of files',
  })
  files: GetFilesResponseItem[];

  @ApiProperty({
    description: 'Token for the next page, if available',
    required: false,
  })
  nextPageToken?: string;
}

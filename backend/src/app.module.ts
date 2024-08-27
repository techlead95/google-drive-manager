import { Module } from '@nestjs/common';
import { GoogleDriveModule } from './google-drive/google-drive.module';

@Module({
  imports: [GoogleDriveModule],
})
export class AppModule {}

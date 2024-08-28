import { Module } from '@nestjs/common';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GoogleDriveModule,
  ],
})
export class AppModule {}

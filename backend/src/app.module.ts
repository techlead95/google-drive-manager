import { Module } from '@nestjs/common';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    GoogleDriveModule,
  ],
})
export class AppModule {}

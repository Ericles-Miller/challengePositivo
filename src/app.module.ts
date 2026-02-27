import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './client/client.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot(process.env.DATABASE_URL || ''), ClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

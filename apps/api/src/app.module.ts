import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PropertyModule } from './property/property.module';
import { EmailModule } from './email/email.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [PropertyModule, UserModule, AuthModule, ChatModule, EmailModule, RatingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

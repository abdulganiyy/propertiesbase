import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PropertyModule } from './property/property.module';
import { EmailModule } from './email/email.module';
import { RatingsModule } from './ratings/ratings.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PaystackService } from './paystack/paystack.service';

@Module({
  imports: [PropertyModule, UserModule, AuthModule, ChatModule, EmailModule, RatingsModule, SubscriptionModule],
  controllers: [AppController],
  providers: [AppService, PaystackService],
})
export class AppModule {}

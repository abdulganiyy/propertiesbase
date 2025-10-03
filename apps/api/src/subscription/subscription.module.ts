import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from 'src/prisma.service';
import { PaystackService } from 'src/paystack/paystack.service';

@Module({
  providers: [SubscriptionService, PrismaService, PaystackService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}

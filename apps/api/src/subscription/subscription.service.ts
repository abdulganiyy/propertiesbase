import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubscriptionTier } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getUserEmail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    return { email: user!.email };
  }

  async markActive(
    userId: string,
    tier: SubscriptionTier,
    planCode: string,
    paystackSubId?: string,
    currentPeriodEnd?: Date,
  ) {
    await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        tier,
        planCode,
        status: 'active',
        paystackSubscriptionId: paystackSubId,
        currentPeriodEnd,
        canceledAt: null,
      },
      create: {
        userId,
        tier,
        planCode,
        status: 'active',
        paystackSubscriptionId: paystackSubId,
        currentPeriodEnd,
      },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { subscriptionTier: tier },
    });
  }

  async markInactive(userId: string, reason = 'inactive') {
    await this.prisma.subscription.update({
      where: { userId },
      data: { status: reason, canceledAt: new Date() },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { subscriptionTier: 'FREE' },
    });
  }

  async processWebhook(payload: any) {
    const event = payload.event as string;
    const meta = payload?.data?.metadata || {};
    const userId = meta.userId;

    switch (event) {
      case 'charge.success': {
        // initial payment success — customer is subscribed if plan was provided
        const tier = (meta.tier as SubscriptionTier) || 'STANDARD';
        const planCode =
          payload?.data?.plan || payload?.data?.subscription?.plan?.plan_code;
        const subId = payload?.data?.subscription?.subscription_code;
        const nextPayment = payload?.data?.subscription?.next_payment_date
          ? new Date(payload.data.subscription.next_payment_date)
          : undefined;
        if (userId && planCode)
          await this.markActive(userId, tier, planCode, subId, nextPayment);
        break;
      }
      case 'subscription.create': {
        const planCode = payload?.data?.plan?.plan_code;
        const subCode = payload?.data?.subscription_code;
        const tier: SubscriptionTier =
          planCode === process.env.PREMIUM_PLAN_CODE ? 'PREMIUM' : 'STANDARD';
        if (userId && planCode)
          await this.markActive(userId, tier, planCode, subCode);
        break;
      }
      case 'invoice.payment_failed':
      case 'subscription.disable': {
        if (userId) await this.markInactive(userId, event);
        break;
      }
      default:
        // ignore other events
        break;
    }
  }
}

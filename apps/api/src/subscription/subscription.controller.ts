// src/subscriptions/subscriptions.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { PaystackService } from '../paystack/paystack.service';
import * as crypto from 'crypto';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private subs: SubscriptionService,
    private paystack: PaystackService,
  ) {}

  @Post('checkout')
  async checkout(
    @Body() body: { userId: string; tier: 'STANDARD' | 'PREMIUM' },
  ) {
    const plan =
      body.tier === 'STANDARD'
        ? process.env.STANDARD_PLAN_CODE!
        : process.env.PREMIUM_PLAN_CODE!;

    const { email } = await this.subs.getUserEmail(body.userId);

    const init = await this.paystack.initializeTransaction({
      email,
      plan, // <- plan code creates subscription
      metadata: { userId: body.userId, tier: body.tier },
      // callback_url: `${process.env.APP_BASE_URL}/billing/verify`, // optional
    });

    return {
      authorizationUrl: init.data.authorization_url,
      reference: init.data.reference,
    };
  }

  // Webhook endpoint url: https://api.yourapp.com/subscriptions/webhook
  @Post('webhook')
  async webhook(
    @Req() req: any,
    @Res() res: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const rawBody = JSON.stringify(req.body); // ensure raw body middleware preserves this
    const computed = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest('hex');
    if (computed !== signature)
      throw new ForbiddenException('Invalid signature');

    const event = req.body?.event;

    // Common events to handle:
    // - charge.success (initial payment success)
    // - subscription.create
    // - invoice.create / invoice.payment_failed
    // - subscription.disable
    // Docs: Subscriptions + Webhooks
    await this.subs.processWebhook(req.body);

    return res.status(200).send('ok');
  }
}

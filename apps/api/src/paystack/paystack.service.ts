import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

const PAYSTACK_BASE = 'https://api.paystack.co';

@Injectable()
export class PaystackService {
  private headers = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  async initializeTransaction(payload: {
    email: string;
    plan: string; // plan code PLN_xxx
    metadata?: Record<string, any>;
    callback_url?: string; // optional
  }) {
    try {
      const res = await axios.post(
        `${PAYSTACK_BASE}/transaction/initialize`,
        { ...payload, amount: payload.plan == 'STANDARD' ? 20000 : 1500000 },
        { headers: this.headers },
      );
      return res.data; // contains data.authorization_url, reference, access_code
    } catch (e: any) {
      throw new HttpException(
        e.response?.data || e.message,
        e.response?.status || 400,
      );
    }
  }

  async verifyTransaction(reference: string) {
    const res = await axios.get(
      `${PAYSTACK_BASE}/transaction/verify/${reference}`,
      { headers: this.headers },
    );
    return res.data;
  }
}

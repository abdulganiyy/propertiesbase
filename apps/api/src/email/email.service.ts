import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, template: string, context: any) {
    // Configure Handlebars templates
    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          partialsDir: 'templates',
          defaultLayout: false,
        },
        viewPath: 'src/email/templates',
        extName: '.hbs',
      } as any),
    );

    try {
      const info = this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to,
        subject,
        template, // Handlebars template name
        context, // variables for template
      } as any) as any;

      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error('Failed to send email', error.stack);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, username: string) {
    return this.sendMail(to, 'Welcome to My App 🎉', 'welcome', { username });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    return this.sendMail(to, 'Password Reset Request', 'reset-password', {
      resetUrl,
    });
  }

  async sendVerificationEmail(to: string, username: string, token: string) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    return this.sendMail(to, 'Verify your email address', 'verify-email', {
      username,
      verifyUrl,
    });
  }
}

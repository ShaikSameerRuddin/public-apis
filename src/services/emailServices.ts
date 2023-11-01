import nodemailer, { Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import  SMTPTransport  from 'nodemailer/lib/smtp-transport';
import {nodemailerConfig} from '../../config/nodemailerConfig'

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<SentMessageInfo> => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    const transporter: Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport(nodemailerConfig);

    return await transporter.sendMail({
      from: '"Sameer Ruddin" <sameerruddinshaik@gmail.com>',
      to : Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    });
  } catch (error) {
    throw new Error(`Error in sending email: ${error}`);
  }
};



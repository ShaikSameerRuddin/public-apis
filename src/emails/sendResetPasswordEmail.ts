import {sendEmail} from '../services/emailServices';

export const sendResetPasswordEmail = async ({
  name,
  email,
  token,
  origin,
}: {
  name: string;
  email: string;
  token: string;
  origin: string;
}): Promise<any> => {
  const resetURL = `${origin}/api/v1/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: 'Reset Password',
    html: `<h4>Hello, ${name}</h4>
   ${message}
   `,
  });
};



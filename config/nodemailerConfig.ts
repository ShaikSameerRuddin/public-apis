export const nodemailerConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure:false,
    auth: {
      user:process.env.SMPT_USER ,
      pass:process.env.SMPT_PASS,
    },
  };
  
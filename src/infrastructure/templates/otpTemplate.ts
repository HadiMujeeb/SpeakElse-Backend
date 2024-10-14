export const otpTemplate = (name: string, otp: string ,expireAt:Date): { subject: string, html: string } => {
    const subject = 'Your OTP Code for Verification';
    const html= `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              p {
                  font-size: 16px;
                  line-height: 1.5;
                  color: #555;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #007bff;
                  text-align: center;
                  padding: 10px;
                  border: 1px dashed #007bff;
                  display: inline-block;
                  margin-top: 20px;
              }
              .footer {
                  margin-top: 30px;
                  font-size: 14px;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>OTP Verification</h1>
              <p>Dear ${name},</p>
              <p>We received a request to verify your email address for your account.</p>
              <p>Your One-Time Password (OTP) for verification is:</p>
              <div class="otp">${otp}</div>
              <p>This OTP is valid for ${expireAt} minutes. Please do not share it with anyone.</p>
              <p>If you did not request this, please ignore this email.</p>
              <div class="footer">
                  <p>Thank you,</p>
                  <p>Your Company Name</p>
              </div>
          </div>
      </body>
      </html>
    `;
    return {subject,html}
  };
  
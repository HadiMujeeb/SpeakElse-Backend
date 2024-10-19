export const getResetPasswordEmailTemplate = (userName: string, resetLink: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          background-color: #ffffff;
          margin: 0 auto;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          background-color: #007bff;
          color: #ffffff;
          padding: 10px 0;
        }
        .content {
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </p>
          <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <p>Thank you,</p>
          <p>The [Your Company Name] Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} [Your Company Name]. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
  
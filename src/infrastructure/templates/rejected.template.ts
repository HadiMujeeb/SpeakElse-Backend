export const getRejectionEmailTemplate = (userName: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mentor Application Rejected</title>
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
            background-color: #F44336;
            color: #ffffff;
            padding: 10px 0;
          }
          .content {
            margin: 20px 0;
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
            <h1>Application Status: Rejected</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for your interest in becoming a mentor. Unfortunately, after reviewing your application, we regret to inform you that it does not meet our criteria at this time.</p>
            <p>If you'd like to reapply in the future, please feel free to reach out for further guidance on improving your application.</p>
            <p>Thank you for your time and effort.</p>
            <p>Best regards,</p>
            <p>The [Your Company Name] Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} [Your Company Name]. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
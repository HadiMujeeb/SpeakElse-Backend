export const getApprovalEmailTemplate = (userName: string, loginUrl: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mentor Application Approved</title>
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
            background-color: #4CAF50;
            color: #ffffff;
            padding: 10px 0;
          }
          .content {
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
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
            <h1>Welcome to the Mentor Program!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Congratulations! Your application to become a mentor has been approved. You can now log in to your mentor dashboard using the link below:</p>
            <p style="text-align: center;">
              <a href="${loginUrl}" class="button">Log in to Your Dashboard</a>
            </p>
            <p>Once logged in, complete your profile and start mentoring!</p>
            <p>We’re excited to have you on board.</p>
            <p>Thank you,</p>
            <p>The [SpeakElse] Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} [Your Company Name]. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
import nodemailer from 'nodemailer';
import env from '../utils/env.js';
const sendEmail = async (username, url) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .email-header {
                background-color: #007bff;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .email-body {
                padding: 20px;
                color: #333333;
            }
            .email-body p {
                line-height: 1.6;
            }
            .email-footer {
                text-align: center;
                font-size: 12px;
                color: #777777;
                padding: 10px;
                background-color: #f2f2f2;
            }
            .verification-link {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                color: #ffffff;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 4px;
            }
            .verification-link:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>Verify Your Account</h1>
            </div>
            <div class="email-body">
                <p>Hi <strong>${username}</strong>,</p>
                <p>Thank you for creating an account with us. Please click the button below to verify your email address and activate your account:</p>
                <a href="${url}" class="verification-link">Verify My Account</a>
                <p>If the button above doesn't work, you can also copy and paste the following URL into your web browser:</p>
                <p>${url}</p>
                <p>Thank you,<br>The Team</p>
            </div>
            <div class="email-footer">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

  const mailOptions = {
    from: '"Kitten Care Admin" <admin@kittencare.com>',
    to: 'janexmgd@gmail.com',
    subject: 'Activate your account',
    html: template,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default sendEmail;

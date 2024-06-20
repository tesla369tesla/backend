require('dotenv').config({ path: `${process.cwd()}/.env` });

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services
  auth: {
    user: 'sundar.n1988@gmail.com',
    pass:'rxhm ffez isob teil'
  }
});

const sendConfirmationEmail = (email, token) => {
  const url = `${process.env.DOMAIN_NAME}/api/v1/email-conformation?token=${token}`;
  
  transporter.sendMail({
    to: email,
    subject: 'Email Confirmation',
    html: generateEmailTemplate(url)
  });
};


// Define the email template
const generateEmailTemplate = (url) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border: 1px solid #dddddd;
    }
    .header {
      text-align: center;
      padding: 10px 0;
      background-color: #0073e6;
      color: #ffffff;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #aaaaaa;
    }
    a {
      color: #0073e6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Email Confirmation</h1>
    </div>
    <div class="content">
      <p>Please click the link below to confirm your email:</p>
      <p><a href="${url}">${url}</a></p>
    </div>
    <div class="footer">
      <p>If you did not request this email, please ignore it.</p>
    </div>
  </div>
</body>
</html>
`;


module.exports = { sendConfirmationEmail };
require('dotenv').config({ path: `${process.cwd()}/.env` });
const pool = require('../services/database')
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendConfirmationEmail } = require('./mailer');
const query = require('./queries')
const { successResponse, errorResponse } = require('../utils/responseUtil');
const { request } = require('http');


async function isEmailRegistered(email) {
  const query = 'SELECT 1 FROM userprofile WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rowCount > 0;
}


const register = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).send('Email and password are required');
  }


  try {
    const emailExists = await isEmailRegistered(email);
    if (emailExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already registered',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(20).toString('hex');
    const result = await pool.query(query.createUserQuery, [firstname, lastname, email, hashedPassword, token, new Date()]);
    sendConfirmationEmail(email, token);
    return successResponse(res, 'Registration successful. Confirmation email sent to your registered email.', 201);
  } catch (error) {
    return errorResponse(res, 'Error creating user', 500, error.message);
  }
};


const emailConformation = async (req, res, next) => {
  const token = req.query.token;
  const result = await pool.query(query.getUserQuery, [token]);

  const htmlResponse = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 10px 0;
        }
        .content {
          padding: 20px;
        }
        .footer {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Confirmed Successfully</h1>
        </div>
        <div class="content">
          <p>Your email address has been verified successfully. You can access your account now <a href="${process.env.LOGIN_URL}" target="_blank">Click here to login</a>..</p>
          <p>Thank you!</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`;

  if (result?.rows[0]?.confirmed_email) {
    res.json({ message: 'Your Email is Already Verified' })
  } else {
    await pool.query(query.getUserUpdateQuery, [token]);
    // res.json({ message: htmlResponse })
    res.send(htmlResponse);
  }

}






module.exports = { register, emailConformation }

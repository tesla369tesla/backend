const pool = require('../services/database')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const query = require('./queries')

const login = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    console.log("hii")

    try {
        const result = await pool.query('SELECT * FROM userprofile WHERE email = $1', [email]);

        const user = result.rows[0];
        console.log(user)
        if (user === undefined) {
            return res.status(500).json({ status: 'error', message: 'User not registered. Please check your username or sign up if you don\'t have an account.' });
        }
        if (!user.confirmed_email) {
            return res.status(400).json({ status: 'error', message: 'An Email sent to your account please verify' });
        }

        if (!user) {
            return res.status(400).json({ status: 'error', message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.user_id, email: user.email, name: user.firstname, isDomain: user.is_vaild_domain }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });

        res.status(200).json({ status: 'success', message: 'Login successful', token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }

}
// Protected route
// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

const userProfile = async (req, res, next) => {
    res.status(200).json({ message: `Welcome, ${req.user.email}` });
};



const acknowledgment = async (req, res, next) => {

    try {
        const email = req.body.email;
        const result = await pool.query('SELECT * FROM userprofile WHERE email = $1', [email]);
        const user = result.rows[0];
        const emailConfirmation_token = user.confirmation_token;

        const result2 = await pool.query(query.getAcknowledgmentQuery, [emailConfirmation_token]);
        const UpdatedUser = result2.rows[0];
        console.log("=UpdatedUser=>", UpdatedUser)
        const token = jwt.sign({ id: UpdatedUser.user_id, email: UpdatedUser.email, name: UpdatedUser.firstname, isDomain: UpdatedUser.is_vaild_domain }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        console.log("=token=>", token)
        res.status(200).json({ status: 'success', message: 'Acknowledgment successfully', token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

module.exports = { login, userProfile, authenticateToken, acknowledgment }
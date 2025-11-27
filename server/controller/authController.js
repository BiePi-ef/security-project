import User from "../models/user.js";
import cryptPassword from "../services/hash.js";
import jwt from 'jsonwebtoken';

process.loadEnvFile("./.env");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const cryptedPassword = cryptPassword(password);
    const user = await User.findOne({email: email, password: cryptedPassword});
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      id: user._id,
      username: user.userName,
      role: user.role
    };
    
    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    if (err.message === 'Invalid credentials') return res.status(401).json({
      error: err,
      message: 'Invalid credentials'
    });

    return res.status(500).send({
      error: err,
      message: 'Error during login'
    });
  }
};

export default {
  login
}
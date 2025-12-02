import LastConnections from "../models/lastConnections.js";
import User from "../models/user.js";
import crypt from "../services/hash.js";
import jwt from 'jsonwebtoken';

process.loadEnvFile("./.env");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // if someone tries to connect with a less than 1 hour expired token :
    if (req.headers.authorization) {
      let connection = await LastConnections
        .findOne({token: crypt(req.headers.authorization)})
        .sort({ created_at: -1 });

        // 1 heure s'est écoulé || token expired et moins qu'une heure
      if (
        (Date.now() - connection.created_at.getTime()) > 3600000 || 
        ( connection.expired && Date.now() - connection.created_at.getTime() < 3600000 ) 
      ) {
        throw new Error('Invalid token');
      }
    }

    // Find user
    const cryptedPassword = crypt(password);
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

    // keep a 1h trace of loggin in DB, to allow a loggout before the token expires
    const hashedToken = crypt(token);
    LastConnections.create({ token : hashedToken });

    // giving user._id could be a problem.
    res.json({ message: 'Login successful', token, id: user._id, role: user.role });
  } catch (err) {
    if (err.message === 'Invalid credentials') return res.status(401).json({
      error: err,
      message: 'Invalid credentials'
    });

    return res.status(500).send({
      error: err.message,
      message: 'Error during login'
    });
  }
};

const logout = async (req, res, next) => {
  try {
    let cryptedToken = crypt(req.body.token);
    const connection = await LastConnections
    .findOneAndUpdate(
      {token: cryptedToken},
      {expired: true},
      {sort: {created_at : -1}}
    );
        
    res.json({ message: 'Logout successful' }); 
  } catch (err) {
    if (err.message === 'Invalid credentials') return res.status(401).json({
      error: err,
      message: 'Invalid credentials'
    });

    return res.status(500).send({
      error: err.message,
      message: 'Error during logout'
    });
  }
};


export default {
  login,
  logout
}
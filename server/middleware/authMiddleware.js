import jwt from 'jsonwebtoken';
import {isAdmin as isAdminS} from '../services/authService.js';
import User from '../models/user.js';

process.loadEnvFile("./.env");

const isAdmin = async (req, res, next) => {
  try {
    if (!isAdminS(req.user)) {
      return res.status(403).json({ message: 'Access denied: admin role required' });
    }
    next();
  } catch (err) {
    return res.status(500).send({
      error: err,
      message: 'Only auth persons can access this part of the app'
    });
  }
};

const isAuth  =  async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalide' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check if user exists
    // if (!User.exists({_id: decoded._id})) {
    //   return res.status(401).json({ message: 'Token missing or invalide' });
    // }
    // actually not a good idea : it shows wheather or not this id exists in DB

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(500).send({
      error: err,
      message: 'You must be authenticated to access this part'
    });
  }
};

export default {
  isAuth,
  isAdmin
}
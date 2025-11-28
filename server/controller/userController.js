import User from "../models/user.js";
import isAdmin from "../services/authService.js";
import crypt from '../services/hash.js';

const createUser = async (req, res, next) => {
  try {
    const { userName, email, password, role } = req.body;
    let error = [];
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    let explodedPassword = password.split("");

    if (explodedPassword.length<12){
      error.push( "Password length must be more than 12");
    }

    // test syntaxe (double it with a front test to prevent long computing time)
    let isMaj = false;
    let isMin = false;
    let isNum = false;
    let isSpe = false;
    for (let i=0; i<explodedPassword.length; i++){
      explodedPassword[i].match(/[A-Z]/) ? isMaj=true : isMaj=isMaj;
      explodedPassword[i].match(/[a-z]/) ? isMin=true : isMin=isMin;
      explodedPassword[i].match(/[0-9]/) ? isNum=true : isNum=isNum;
      // tests for !@#$%^&*()_+-=;:|,.<>?]
      !explodedPassword[i].match(/[a-zA-Z0-9{}'"\\\/\[\]]/) ? isSpe=true : isSpe=isSpe;
    }
    
    if (!isMaj){
      error.push("Password must contain at least a majuscule");
    }
    if (!isMin){
      error.push("Password must contain at least a minuscule");
    }
    if (!isNum){
      error.push("Password must contain at least a number");
    }
    if (!isSpe){
      error.push("Password must contain at least a special character");
    }
    if (error.length>0){
      let err = new Error(error);
      throw err;
    }
    
    const cryptedPassword = crypt(password);
    
    // Single insert, no session needed
    const newUser = User.create({ userName, email, cryptedPassword, role });

    return res.status(201).json(newUser);
  } catch (err) {
    // Handle duplicate email
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    return res.status(500).json({ error: err?.message || err });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).send({
      error: err,
      message: 'Error retrieving users'
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // check if user is admin, or the one auth at the moment 
    if (!isAdmin(req.user)){
      if (!(req.user.id === id)){
        return res.status(403).json({ message: 'Unauthozied to access this user\'s informations' });
      }
    }

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      error: err?.message || err,
      message: 'Error retrieving user'
    });
  }
};

export default {
  getAllUsers,
  createUser,
  getUserById
}
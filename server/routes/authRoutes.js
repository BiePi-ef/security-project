import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authController from '../controller/authController.js';

let router = express.Router();

// in fine :
// router.get('/users', userController.getAllUsers);

router.post('/login', authController.login);

export default router;
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authController from '../controller/authController.js';

let router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authMiddleware.isAuth, authController.logout)

export default router;
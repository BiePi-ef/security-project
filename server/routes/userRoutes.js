import express from 'express';
import userController from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

let router = express.Router();

// in fine :
// router.get('/users', userController.getAllUsers);

router.post('/', userController.createUser);
router.get('/:id', authMiddleware.isAuth, userController.getUserById);
router.get('/', authMiddleware.isAuth, authMiddleware.isAdmin ,userController.getAllUsers);

export default router;
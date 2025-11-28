import express from 'express';
import objectController from '../controller/objectController.js';
import authMiddleware from '../middleware/authMiddleware.js';

let router = express.Router();  

router.post('/', authMiddleware.isAuth, objectController.create);

export default router;
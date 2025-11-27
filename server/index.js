import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './db/db.js';

process.loadEnvFile("./.env");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

// routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import objectRoutes from './routes/objectRoutes.js';
import './db/db.js';

process.loadEnvFile("./.env");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

// allow only your frontend origin and allow credentials if needed
app.use(cors({
  origin: 'http://localhost:5173', // or an array of origins
  credentials: true,
}));

// routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/objects', objectRoutes);

// Sonarqube Security Hotspot fix :
// version of express displayed by default in app header. Can cause harm if hackers know the version
// This disables it
app.disable("x-powered-by");

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

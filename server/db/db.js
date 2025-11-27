import mongoose from 'mongoose';
process.loadEnvFile("./.env");

const port = process.env.DB_PORT;
const db_name = process.env.DB_NAME;
const db_user = encodeURIComponent(process.env.DB_USER);
const db_password = encodeURIComponent(process.env.DB_PASSWORD);

const mongoURI = `mongodb://${db_user}:${db_password}@localhost:${port}/${db_name}`;

await mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

export default mongoose;
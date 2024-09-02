import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';

const app = express();
const uri = 'mongodb://127.0.0.1:27017/chatApp';

app.use(express.json());
app.use(cors());

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');

    app.use('/api/users', authRoutes);
    app.use('/api/messages', messageRoutes);

    const port = 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });
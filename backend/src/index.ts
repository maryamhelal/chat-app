import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import { sendMessage } from './controllers/messageController';

const app = express();
const uri = 'mongodb://127.0.0.1:27017/chatApp';
const io = require('socket.io')(3001, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

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

    io.on('connection', (socket: any) => {
      console.log('A user connected', socket.id);

      socket.on('joinRoom', ({ sender, receiver }: { sender: string, receiver: string }) => {
        const room = `${sender}-${receiver}`;
        socket.join(room);
        console.log(`${sender} and ${receiver} joined room ${room}`);
      });

      socket.on('sendMessage', ({ sender, receiver, message }: { sender: string, receiver: string, message: string }) => {
        const response = sendMessage( sender, receiver, message );
        const room = `${sender}-${receiver}`;
        const room2 = `${receiver}-${sender}`;
        io.to(room).emit('receiveMessage', { sender, message, time: new Date().toISOString(), response });
        io.to(room2).emit('receiveMessage', { sender, message, time: new Date().toISOString(), response });
      });
    });
  })

  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });
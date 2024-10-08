import { Request, Response } from 'express';
import Message from '../models/Message';

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { sender, receiver } = req.query;

        if (!sender) {
            return res.status(400).json({ message: 'Sender required' });
        }
        if (!receiver) {
            return res.status(400).json({ message: 'Receiver required' });
        }

        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ timestamp: 1 });

        if (!messages.length) {
            return res.status(200).json({ messages: [] });
        }

        res.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendMessage = async (sender: string, receiver: string, message: string) => {
    try {

        if (!sender || !receiver || !message) {
            return { message: 'Sender, receiver, and message are required' };
        }

        const newMessage = new Message({
            sender,
            receiver,
            message,
            timestamp: new Date()
        });

        await newMessage.save();

        return { message: 'Message sent successfully', data: newMessage };
    } catch (error) {
        console.error('Error sending message:', error);
        return { message: 'Server error' };
    }
};
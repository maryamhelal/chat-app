import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/messageController';

const router = Router();

router.get('/getMessages', getMessages);

router.post('/send', sendMessage);

export default router;
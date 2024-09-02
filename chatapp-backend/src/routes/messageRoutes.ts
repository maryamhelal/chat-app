import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/messageController';

const router = Router();

router.get('/getMessages', getMessages);

export default router;
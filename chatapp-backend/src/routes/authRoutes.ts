import { Router } from 'express';
import { signup, login, getUserName, getPeopleList } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/process-name', getUserName); 
router.get('/people-list', getPeopleList);

export default router;
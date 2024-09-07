import { Router } from 'express';
import { signup, login, getUserName, getPeopleList, logout } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/process-name', getUserName); 
router.get('/people-list', getPeopleList);

export default router;
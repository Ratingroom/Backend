import { Router } from 'express';
import { getHome } from '../controller/home.controller.js';

const router = Router();

router.get('/home', getHome);

export default router;

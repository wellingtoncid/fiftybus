import { Router } from 'express';
import { checkinController } from '../controllers/checkinController';

const router = Router();

router.post('/:bookingId', checkinController.doCheckin);

export default router;

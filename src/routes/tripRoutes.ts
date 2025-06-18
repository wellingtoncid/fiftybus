import { Router } from 'express';
import { getTrips, createTrip } from '../controllers/tripController';

const router = Router();

router.get('/', getTrips);
router.post('/', createTrip);

export default router;
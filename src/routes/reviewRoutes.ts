import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { auditLog } from '../middlewares/auditMiddleware';

const router = Router();

router.post('/reviews', auditLog('create', 'review'), reviewController.createReview);
router.get('/reviews/trip/:tripId', reviewController.listReviewsByTrip);
router.put('/reviews/:id', auditLog('update', 'review'), reviewController.updateReview);
router.delete('/reviews/:id', auditLog('delete', 'review'), reviewController.deleteReview);

export default router;

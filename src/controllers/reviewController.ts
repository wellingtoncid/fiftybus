import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';

export async function createReview(req: Request, res: Response) {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create review', details: error });
  }
}

export async function listReviewsByTrip(req: Request, res: Response) {
  try {
    const reviews = await reviewService.getReviewsByTrip(req.params.tripId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: error });
  }
}

export async function updateReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedReview = await reviewService.updateReview(id, req.body);
    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.locals.entityId = id;
    res.locals.metadata = { updatedFields: Object.keys(req.body) };
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update review', details: error });
  }
}
export async function deleteReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await reviewService.deleteReview(id);
    res.locals.entityId = id;
    res.locals.metadata = { action: 'delete' };
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete review', details: error });
  }
}
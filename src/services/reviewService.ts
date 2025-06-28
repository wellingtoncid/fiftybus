import { prisma } from '../lib/prisma';

interface ReviewData {
  tripId: string;
  userId: string;
  driverRating: number;
  vehicleRating: number;
  comments?: string;
}

export async function createReview(data: ReviewData) {
  return prisma.review.create({
    data: {
      tripId: data.tripId,
      userId: data.userId,
      driverRating: data.driverRating,
      vehicleRating: data.vehicleRating,
      comments: data.comments,
    },
  });
}

export async function getReviewsByTrip(tripId: string) {
  return prisma.review.findMany({
    where: { tripId },
    include: { user: true },
  });
}

export async function updateReview(id: string, data: Partial<ReviewData>) {
  return prisma.review.update({
    where: { id },
    data,
  });
}

export async function deleteReview(id: string) {
  return prisma.review.delete({
    where: { id },
  });
}
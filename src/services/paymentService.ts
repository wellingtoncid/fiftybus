import { prisma } from "../lib/prisma";

export const paymentService = {
  getAll: () => prisma.payment.findMany(),

  getById: (id: string) =>
    prisma.payment.findUnique({
      where: { id },
    }),

  create: (data: {
    bookingId: string;
    gateway: "mercadopago" | "stripe" | "manual";
    status: "approved" | "failed" | "pending";
    amount: number;
    paidAt: Date;
    transactionId: string;
  }) => prisma.payment.create({ data }),

  update: (id: string, data: Partial<{
    gateway: "mercadopago" | "stripe" | "manual";
    status: "approved" | "failed" | "pending";
    amount: number;
    paidAt: Date;
    transactionId: string;
  }>) =>
    prisma.payment.update({
      where: { id },
      data,
    }),

  delete: (id: string) => prisma.payment.delete({ where: { id } }),
};

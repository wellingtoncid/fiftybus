import { Request, Response } from "express";
import { paymentService } from "../services/paymentService";

export const paymentController = {
  async getAll(req: Request, res: Response) {
    const payments = await paymentService.getAll();
    res.json(payments);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const payment = await paymentService.getById(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  },

  async create(req: Request, res: Response) {
    try {
      const payment = await paymentService.create(req.body);
      res.locals.entityId = payment.id;
      res.locals.metadata = { amount: payment.amount, method: payment.status };
      res.status(201).json(payment);
    } catch (err) {
      res.status(400).json({ error: "Error creating payment", details: err });
    }
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const payment = await paymentService.update(id, req.body);
      res.locals.entityId = payment.id;
      res.locals.metadata = { amount: payment.amount, method: payment.status };
      res.json(payment);
    } catch (err) {
      res.status(400).json({ error: "Error updating payment", details: err });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await paymentService.delete(id);
      res.locals.entityId = id;
      res.locals.metadata = { action: "delete" };
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: "Error deleting payment", details: err });
    }
  },
};

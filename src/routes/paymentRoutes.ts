import { Router } from "express";
import { paymentController } from "../controllers/paymentController";
import { asyncHandler } from "../utils/asyncHandler";
import { auditLog } from "../middlewares/auditMiddleware";

const router = Router();

router.get("/payment", asyncHandler(paymentController.getAll));
router.get("/payment/:id", asyncHandler(paymentController.getById));
router.post('/payment', auditLog('create', 'payment'), asyncHandler(paymentController.create));
router.put("/payment/:id", auditLog('update', 'payment'), asyncHandler(paymentController.update));
router.delete("/payment/:id", auditLog('delete', 'payment'), asyncHandler(paymentController.delete));

export default router;
import { Router } from "express";
import { paymentController } from "../controllers/paymentController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(paymentController.getAll));
router.get("/:id", asyncHandler(paymentController.getById));
router.post("/", asyncHandler(paymentController.create));
router.put("/:id", asyncHandler(paymentController.update));
router.delete("/:id", asyncHandler(paymentController.delete));

export default router;
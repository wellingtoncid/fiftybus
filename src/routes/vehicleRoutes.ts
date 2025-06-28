import { Router } from 'express';
import { vehicleController } from '../controllers/vehicleController';
import { auditLog } from '../middlewares/auditMiddleware';
import { isAuthenticated, hasRole } from '../middlewares/authMiddleware';

const router = Router();

router.use(isAuthenticated);

router.post(
  '/',
  hasRole('admin'),
  auditLog('CREATE', 'Vehicle'),
  vehicleController.createVehicle
);

router.get('/', vehicleController.listVehicles);
router.get('/:id', vehicleController.getVehicleById);

router.put(
  '/:id',
  hasRole('admin'),
  auditLog('UPDATE', 'Vehicle'),
  vehicleController.updateVehicle
);

router.delete(
  '/:id',
  hasRole('admin'),
  auditLog('DELETE', 'Vehicle'),
  vehicleController.deleteVehicle
);

export default router;
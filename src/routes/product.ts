import { Router } from "express";
import {
  addProduct,
  getLeadAcidBatteryStock,
  getLeadAcidChargerStock,
  getLithiumIonBatteryStock,
  getLithiumIonChargerStock,
} from "../controller/product";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/add-products",    authenticateToken, addProduct);
router.get("/lead-acid-battery",  getLeadAcidBatteryStock);
router.get("/lead-acid-charger",  getLeadAcidChargerStock);
router.get(
  "/lithium-ion-battery",

  getLithiumIonBatteryStock
);
router.get(
  "/lithium-ion-charger",
  getLithiumIonChargerStock
);

export default router;

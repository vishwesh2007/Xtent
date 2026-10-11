import express from "express";

import {
  getDashboardStats,
  getMyDashboard,
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/auth.js";
import orgContext from "../middleware/orgContext.js";

const router = express.Router();

router.use(protect, orgContext);

router.get("/stats", getDashboardStats);

router.get("/my", getMyDashboard);

export default router;

import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  recalculateProjectProgress,
} from "../controllers/projectController.js";

import { protect, authorizeRoles } from "../middleware/auth.js";

import orgContext from "../middleware/orgContext.js";

const router = express.Router();

router.use(protect, orgContext);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.post("/", authorizeRoles("admin"), createProject);

router.patch("/:id", authorizeRoles("admin", "manager"), updateProject);

router.delete("/:id", authorizeRoles("admin"), deleteProject);

router.post(
  "/:id/recalculate-progress",
  authorizeRoles("admin", "manager"),
  recalculateProjectProgress,
);

export default router;

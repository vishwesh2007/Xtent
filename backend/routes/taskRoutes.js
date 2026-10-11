import express from "express";

import {
  createTask,
  getTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

import { protect, authorizeRoles } from "../middleware/auth.js";

import orgContext from "../middleware/orgContext.js";

const router = express.Router();

router.use(protect, orgContext);

router.get("/", getTasks);

router.get("/my", getMyTasks);

router.get("/:id", getTaskById);

router.post("/", authorizeRoles("admin", "manager"), createTask);

router.patch("/:id", authorizeRoles("admin", "manager"), updateTask);

router.patch("/:id/status", updateTaskStatus);

router.delete("/:id", authorizeRoles("admin", "manager"), deleteTask);

export default router;

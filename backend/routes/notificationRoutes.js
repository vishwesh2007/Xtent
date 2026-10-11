import express from "express";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/auth.js";
import orgContext from "../middleware/orgContext.js";

const router = express.Router();

router.use(protect, orgContext);

router.get("/", getNotifications);

router.get("/unread-count", getUnreadNotificationCount);

router.patch("/:id/read", markNotificationAsRead);

router.patch("/read-all", markAllNotificationsAsRead);

router.delete("/:id", deleteNotification);

export default router;

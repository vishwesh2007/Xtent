import express from "express";

import {
  createOrganization,
  searchOrganizations,
  joinOrganization,
  joinWithCode,
  getMyOrganizations,
  updateOrganization,
  regenerateInviteCode,
} from "../controllers/orgController.js";

import { protect, authorizeRoles } from "../middleware/auth.js";
import  orgContext  from "../middleware/orgContext.js";

const router = express.Router();

router.post("/", protect, createOrganization);

router.get("/search", protect, searchOrganizations);

router.post("/join-with-code", protect, joinWithCode);

router.post("/:id/join", protect, joinOrganization);

router.get("/mine", protect, getMyOrganizations);

router.patch(
  "/:id",
  protect,
  orgContext,
  authorizeRoles("admin"),
  updateOrganization,
);

router.post(
  "/:id/regenerate-code",
  protect,
  orgContext,
  authorizeRoles("admin"),
  regenerateInviteCode,
);

export default router;

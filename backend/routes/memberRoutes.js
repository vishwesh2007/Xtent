import express from "express";

import {
  getMembers,
  getJoinRequests,
  updateMember,
  removeMember,
  leaveOrganization,
} from "../controllers/memberController.js";

import { protect, authorizeRoles } from "../middleware/auth.js";
import  orgContext  from "../middleware/orgContext.js";

const router = express.Router();

router.use(protect, orgContext);

router.get("/", authorizeRoles("admin"), getMembers);

router.get("/requests", authorizeRoles("admin"), getJoinRequests);

router.patch("/:id", authorizeRoles("admin"), updateMember);

router.delete("/:id", authorizeRoles("admin"), removeMember);

router.post("/leave", leaveOrganization);

export default router;

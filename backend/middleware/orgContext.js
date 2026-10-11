import mongoose from "mongoose";

import Membership from "../models/Membership.js";

const orgContext = async (req, res, next) => {
  try {
    console.log("ORG HEADER:", req.headers["x-org-id"]);

    const orgId = req.headers["x-org-id"];

    if (!orgId) {
      return res.status(400).json({
        message: "Workspace not selected",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      return res.status(400).json({
        message: "Invalid workspace ID",
      });
    }

    const membership = await Membership.findOne({
      user: req.user._id,
      organization: orgId,
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Not a member of this workspace",
      });
    }

    req.membership = membership;
    req.orgId = orgId;

    next();
  } catch (error) {
    next(error);
  }
};

export default orgContext;

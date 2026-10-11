import Membership from "../models/Membership.js";

export const getMembers = async (req, res, next) => {
  try {
    const memberships = await Membership.find({
      organization: req.orgId,
      status: "active",
    })
      .populate("user", "name email isActive")
      .select("-__v");

    res.json({
      members: memberships,
    });
  } catch (error) {
    next(error);
  }
};

export const getJoinRequests = async (req, res, next) => {
  try {
    const requests = await Membership.find({
      organization: req.orgId,
      status: "pending",
    })
      .populate("user", "name email isActive")
      .select("-__v")
      .sort({ requestedAt: -1 });

    res.json({
      requests,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    const membership = await Membership.findOne({
      _id: id,
      organization: req.orgId,
    });

    if (!membership) {
      return res.status(404).json({
        message: "Membership not found",
      });
    }

    if (membership.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot modify your own membership",
      });
    }

    if (role && !["admin", "manager", "employee"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (
      status &&
      !["pending", "active", "rejected", "removed"].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid membership status",
      });
    }

    if (status === "active") {
      membership.status = "active";
      membership.approvedAt = new Date();
      membership.approvedBy = req.user._id;
    } else if (status) {
      membership.status = status;
    }

    if (role) {
      membership.role = role;
    }

    await membership.save();

    const updatedMembership = await Membership.findById(membership._id)
      .populate("user", "name email isActive")
      .select("-__v");

    res.json({
      message: "Membership updated successfully",
      membership: updatedMembership,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const membership = await Membership.findOne({
      _id: id,
      organization: req.orgId,
      status: "active",
    });

    if (!membership) {
      return res.status(404).json({
        message: "Active membership not found",
      });
    }

    if (membership.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot remove yourself",
      });
    }

    if (membership.role === "admin") {
      const adminCount = await Membership.countDocuments({
        organization: req.orgId,
        role: "admin",
        status: "active",
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: "The last admin cannot be removed",
        });
      }
    }

    membership.status = "removed";
    await membership.save();

    await Project.updateMany(
      {
        organization: req.orgId,
        manager: membership.user,
      },
      {
        $unset: {
          manager: "",
        },
      },
    );

    await Task.updateMany(
      {
        organization: req.orgId,
        assignedTo: membership.user,
      },
      {
        $unset: {
          assignedTo: "",
        },
      },
    );

    res.json({
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const leaveOrganization = async (req, res, next) => {
  try {
    const membership = await Membership.findOne({
      user: req.user._id,
      organization: req.orgId,
      status: "active",
    });

    if (!membership) {
      return res.status(404).json({
        message: "Active membership not found",
      });
    }

    if (membership.role === "admin") {
      const adminCount = await Membership.countDocuments({
        organization: req.orgId,
        role: "admin",
        status: "active",
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: "The last admin cannot leave. Assign another admin first.",
        });
      }
    }

    membership.status = "removed";
    await membership.save();

    await Project.updateMany(
      {
        organization: req.orgId,
        manager: req.user._id,
      },
      {
        $unset: {
          manager: "",
        },
      },
    );

    await Task.updateMany(
      {
        organization: req.orgId,
        assignedTo: req.user._id,
      },
      {
        $unset: {
          assignedTo: "",
        },
      },
    );

    res.json({
      message: "You left the organization successfully",
    });
  } catch (error) {
    next(error);
  }
};

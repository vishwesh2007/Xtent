import Organization from "../models/Organization.js";
import Membership from "../models/Membership.js";
import generateInviteCode from "../utils/generateInviteCode.js";

export const createOrganization = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: "Organization name and slug are required",
      });
    }

    const normalizedSlug = slug.toLowerCase().trim();

    const existingOrganization = await Organization.findOne({
      slug: normalizedSlug,
    });

    if (existingOrganization) {
      return res.status(409).json({
        message: "Organization slug already exists",
      });
    }

    const organization = await Organization.create({
      name: name.trim(),
      slug: normalizedSlug,
      description: description?.trim() || "",
      owner: req.user._id,
      inviteCode: generateInviteCode(),
    });

    await Membership.create({
      user: req.user._id,
      organization: organization._id,
      role: "admin",
      status: "active",
      approvedAt: new Date(),
      approvedBy: req.user._id,
    });

    res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const searchOrganizations = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 3) {
      return res.status(400).json({
        message: "Search must contain at least 3 characters",
      });
    }

    const organizations = await Organization.find({
      isActive: true,
      name: {
        $regex: q.trim(),
        $options: "i",
      },
    })
      .select("name slug description")
      .limit(10);

    res.json({
      organizations,
    });
  } catch (error) {
    next(error);
  }
};

export const joinOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findOne({
      _id: id,
      isActive: true,
    });

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    const existingMembership = await Membership.findOne({
      user: req.user._id,
      organization: organization._id,
    });

    if (existingMembership) {
      return res.status(409).json({
        message: `Membership already exists with status: ${existingMembership.status}`,
      });
    }

    const membership = await Membership.create({
      user: req.user._id,
      organization: organization._id,
      role: "employee",
      status: "pending",
    });

    res.status(201).json({
      message: "Join request submitted",
      membership,
    });
  } catch (error) {
    next(error);
  }
};

export const joinWithCode = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({
        message: "Invite code is required",
      });
    }

    const organization = await Organization.findOne({
      inviteCode: inviteCode.trim().toUpperCase(),
      isActive: true,
    });

    if (!organization) {
      return res.status(404).json({
        message: "Invalid invite code",
      });
    }

    const existingMembership = await Membership.findOne({
      user: req.user._id,
      organization: organization._id,
    });

    if (existingMembership) {
      return res.status(409).json({
        message: `Membership already exists with status: ${existingMembership.status}`,
      });
    }

    const membership = await Membership.create({
      user: req.user._id,
      organization: organization._id,
      role: "employee",
      status: "pending",
    });

    res.status(201).json({
      message: "Join request submitted",
      membership,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganizations = async (req, res, next) => {
  try {
    const memberships = await Membership.find({
      user: req.user._id,
      status: {
        $in: ["active", "pending"],
      },
    })
      .populate(
        "organization",
        "name slug description owner inviteCode isActive createdAt",
      )
      .select("-__v");

    res.json({
      memberships,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const organization = await Organization.findOne({
      _id: id,
      owner: req.user._id,
      isActive: true,
    });

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found or access denied",
      });
    }

    if (name !== undefined) {
      organization.name = name.trim();
    }

    if (description !== undefined) {
      organization.description = description.trim();
    }

    await organization.save();

    res.json({
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const regenerateInviteCode = async (req, res, next) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findOne({
      _id: id,
      owner: req.user._id,
      isActive: true,
    });

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found or access denied",
      });
    }

    organization.inviteCode = generateInviteCode();

    await organization.save();

    res.json({
      message: "Invite code regenerated successfully",
      inviteCode: organization.inviteCode,
    });
  } catch (error) {
    next(error);
  }
};

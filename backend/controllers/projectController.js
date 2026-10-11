import mongoose from "mongoose";

import Project from "../models/Project.js";
import Membership from "../models/Membership.js";
import Task from "../models/Task.js";
import calculateProgress from "../utils/calculateProgress.js";

const validateDateRange = (startDate, deadline) => {
  if (!startDate || !deadline) {
    return "Start date and deadline are required";
  }

  if (new Date(deadline) < new Date(startDate)) {
    return "Deadline cannot be before start date";
  }

  return null;
};

export const createProject = async (req, res, next) => {
  try {
    const {
      name,
      client,
      description,
      manager,
      team,
      startDate,
      deadline,
      budget,
      revenue,
      expense,
      status,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    if (!client?.trim()) {
      return res.status(400).json({
        message: "Client name is required",
      });
    }

    const dateError = validateDateRange(startDate, deadline);

    if (dateError) {
      return res.status(400).json({
        message: dateError,
      });
    }

    let managerUser = null;

    if (manager) {
      if (!mongoose.Types.ObjectId.isValid(manager)) {
        return res.status(400).json({
          message: "Invalid manager ID",
        });
      }

      const managerMembership = await Membership.findOne({
        user: manager,
        organization: req.orgId,
        status: "active",
        role: { $in: ["admin", "manager"] },
      });

      if (!managerMembership) {
        return res.status(400).json({
          message:
            "Selected manager is not an active manager in this workspace",
        });
      }

      managerUser = manager;
    }

    let teamMembers = [];

    if (Array.isArray(team) && team.length > 0) {
      const uniqueTeam = [...new Set(team.map((userId) => userId.toString()))];

      const invalidIds = uniqueTeam.filter(
        (userId) => !mongoose.Types.ObjectId.isValid(userId),
      );

      if (invalidIds.length > 0) {
        return res.status(400).json({
          message: "One or more team member IDs are invalid",
        });
      }

      const memberships = await Membership.find({
        user: { $in: uniqueTeam },
        organization: req.orgId,
        status: "active",
      });

      if (memberships.length !== uniqueTeam.length) {
        return res.status(400).json({
          message: "All team members must be active workspace members",
        });
      }

      teamMembers = uniqueTeam;
    }

    const project = await Project.create({
      organization: req.orgId,
      name: name.trim(),
      client: client.trim(),
      description: description?.trim() || "",
      manager: managerUser,
      team: teamMembers,
      startDate,
      deadline,
      budget: Number(budget) || 0,
      revenue: Number(revenue) || 0,
      expense: Number(expense) || 0,
      status: status || "new",
      progress: 0,
      createdBy: req.user._id,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("manager", "name email")
      .populate("team", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      organization: req.orgId,
    })
      .populate("manager", "name email")
      .populate("team", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({
          organization: req.orgId,
          project: project._id,
        }).select("status");

        const progress = calculateProgress(tasks);

        if (project.progress !== progress) {
          project.progress = progress;
          await project.save();
        }

        return project;
      }),
    );

    res.json({
      projects: projectsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: id,
      organization: req.orgId,
    })
      .populate("manager", "name email")
      .populate("team", "name email")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await Task.find({
      organization: req.orgId,
      project: project._id,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const progress = calculateProgress(tasks);

    if (project.progress !== progress) {
      project.progress = progress;
      await project.save();
    }

    res.json({
      project,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: id,
      organization: req.orgId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const {
      name,
      client,
      description,
      manager,
      team,
      startDate,
      deadline,
      budget,
      revenue,
      expense,
      status,
    } = req.body;

    const nextStartDate = startDate || project.startDate;
    const nextDeadline = deadline || project.deadline;

    const dateError = validateDateRange(nextStartDate, nextDeadline);

    if (dateError) {
      return res.status(400).json({
        message: dateError,
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Project name is required",
        });
      }

      project.name = name.trim();
    }

    if (client !== undefined) {
      if (!client.trim()) {
        return res.status(400).json({
          message: "Client name is required",
        });
      }

      project.client = client.trim();
    }

    if (description !== undefined) {
      project.description = description.trim();
    }

    if (manager !== undefined) {
      if (manager === null || manager === "") {
        project.manager = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(manager)) {
          return res.status(400).json({
            message: "Invalid manager ID",
          });
        }

        const managerMembership = await Membership.findOne({
          user: manager,
          organization: req.orgId,
          status: "active",
          role: { $in: ["admin", "manager"] },
        });

        if (!managerMembership) {
          return res.status(400).json({
            message:
              "Selected manager is not an active manager in this workspace",
          });
        }

        project.manager = manager;
      }
    }

    if (team !== undefined) {
      if (!Array.isArray(team)) {
        return res.status(400).json({
          message: "Team must be an array",
        });
      }

      const uniqueTeam = [...new Set(team.map((userId) => userId.toString()))];

      const invalidIds = uniqueTeam.filter(
        (userId) => !mongoose.Types.ObjectId.isValid(userId),
      );

      if (invalidIds.length > 0) {
        return res.status(400).json({
          message: "One or more team member IDs are invalid",
        });
      }

      const memberships = await Membership.find({
        user: { $in: uniqueTeam },
        organization: req.orgId,
        status: "active",
      });

      if (memberships.length !== uniqueTeam.length) {
        return res.status(400).json({
          message: "All team members must be active workspace members",
        });
      }

      project.team = uniqueTeam;
    }

    if (startDate !== undefined) {
      project.startDate = startDate;
    }

    if (deadline !== undefined) {
      project.deadline = deadline;
    }

    if (budget !== undefined) {
      project.budget = Number(budget) || 0;
    }

    if (revenue !== undefined) {
      project.revenue = Number(revenue) || 0;
    }

    if (expense !== undefined) {
      project.expense = Number(expense) || 0;
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "new",
        "running",
        "completed",
        "cancelled",
        "delayed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid project status",
        });
      }

      project.status = status;
    }

    const tasks = await Task.find({
      organization: req.orgId,
      project: project._id,
    }).select("status");

    project.progress = calculateProgress(tasks);

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("manager", "name email")
      .populate("team", "name email")
      .populate("createdBy", "name email");

    res.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: id,
      organization: req.orgId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await Task.deleteMany({
      organization: req.orgId,
      project: project._id,
    });

    await Project.deleteOne({
      _id: project._id,
      organization: req.orgId,
    });

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const recalculateProjectProgress = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: id,
      organization: req.orgId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await Task.find({
      organization: req.orgId,
      project: project._id,
    }).select("status");

    project.progress = calculateProgress(tasks);

    if (project.progress === 100 && project.status !== "cancelled") {
      project.status = "completed";
    }

    await project.save();

    res.json({
      message: "Project progress recalculated successfully",
      progress: project.progress,
      status: project.status,
    });
  } catch (error) {
    next(error);
  }
};

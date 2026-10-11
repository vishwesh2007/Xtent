import mongoose from "mongoose";

import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Membership from "../models/Membership.js";
import calculateProgress from "../utils/calculateProgress.js";

const allowedPriorities = ["low", "medium", "high"];

const allowedStatuses = [
  "pending",
  "accepted",
  "in_progress",
  "completed",
  "rejected",
];

const updateProjectProgress = async (projectId, organizationId) => {
  const tasks = await Task.find({
    organization: organizationId,
    project: projectId,
  }).select("status");

  const progress = calculateProgress(tasks);

  const project = await Project.findOne({
    _id: projectId,
    organization: organizationId,
  });

  if (!project) {
    return;
  }

  project.progress = progress;

  if (progress === 100 && project.status !== "cancelled") {
    project.status = "completed";
  } else if (progress < 100 && project.status === "completed") {
    project.status = "running";
  }

  await project.save();
};

export const createTask = async (req, res, next) => {
  try {
    const {
      project,
      title,
      description,
      assignedTo,
      priority,
      status,
      dueDate,
    } = req.body;

    if (!project) {
      return res.status(400).json({
        message: "Project is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const projectExists = await Project.findOne({
      _id: project,
      organization: req.orgId,
    });

    if (!projectExists) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    let assignedUser = null;

    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          message: "Invalid assigned user ID",
        });
      }

      const membership = await Membership.findOne({
        user: assignedTo,
        organization: req.orgId,
        status: "active",
      });

      if (!membership) {
        return res.status(400).json({
          message: "Assigned user must be an active member of this workspace",
        });
      }

      assignedUser = assignedTo;
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid task priority",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const task = await Task.create({
      organization: req.orgId,
      project,
      title: title.trim(),
      description: description?.trim() || "",
      assignedTo: assignedUser,
      priority: priority || "medium",
      status: status || "pending",
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    await updateProjectProgress(project, req.orgId);

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name client status")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const filter = {
      organization: req.orgId,
    };

    if (req.query.project) {
      if (!mongoose.Types.ObjectId.isValid(req.query.project)) {
        return res.status(400).json({
          message: "Invalid project ID",
        });
      }

      filter.project = req.query.project;
    }

    if (req.query.assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(req.query.assignedTo)) {
        return res.status(400).json({
          message: "Invalid assigned user ID",
        });
      }

      filter.assignedTo = req.query.assignedTo;
    }

    if (req.query.status) {
      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          message: "Invalid task status",
        });
      }

      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter)
      .populate("project", "name client status")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      organization: req.orgId,
      assignedTo: req.user._id,
    })
      .populate("project", "name client status deadline progress")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: id,
      organization: req.orgId,
    })
      .populate("project", "name client status deadline progress")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: id,
      organization: req.orgId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const { title, description, assignedTo, priority, status, dueDate } =
      req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Task title is required",
        });
      }

      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === "") {
        task.assignedTo = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
          return res.status(400).json({
            message: "Invalid assigned user ID",
          });
        }

        const membership = await Membership.findOne({
          user: assignedTo,
          organization: req.orgId,
          status: "active",
        });

        if (!membership) {
          return res.status(400).json({
            message: "Assigned user must be an active member of this workspace",
          });
        }

        task.assignedTo = assignedTo;
      }
    }

    if (priority !== undefined) {
      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          message: "Invalid task priority",
        });
      }

      task.priority = priority;
    }

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid task status",
        });
      }

      task.status = status;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    await task.save();

    await updateProjectProgress(task.project, req.orgId);

    const updatedTask = await Task.findById(task._id)
      .populate("project", "name client status deadline progress")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const task = await Task.findOne({
      _id: id,
      organization: req.orgId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const role = req.membership.role;

    if (
      role === "employee" &&
      String(task.assignedTo) !== String(req.user._id)
    ) {
      return res.status(403).json({
        message: "You can only update your own tasks",
      });
    }

    task.status = status;

    await task.save();

    await updateProjectProgress(task.project, req.orgId);

    const updatedTask = await Task.findById(task._id)
      .populate("project", "name client status deadline progress")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: id,
      organization: req.orgId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const projectId = task.project;

    await Task.deleteOne({
      _id: task._id,
      organization: req.orgId,
    });

    await updateProjectProgress(projectId, req.orgId);

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Membership from "../models/Membership.js";
import calculateProgress from "../utils/calculateProgress.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const organizationId = req.orgId;

    const [
      totalProjects,
      newProjects,
      runningProjects,
      completedProjects,
      cancelledProjects,
      delayedProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      activeMembers,
    ] = await Promise.all([
      Project.countDocuments({
        organization: organizationId,
      }),

      Project.countDocuments({
        organization: organizationId,
        status: "new",
      }),

      Project.countDocuments({
        organization: organizationId,
        status: "running",
      }),

      Project.countDocuments({
        organization: organizationId,
        status: "completed",
      }),

      Project.countDocuments({
        organization: organizationId,
        status: "cancelled",
      }),

      Project.countDocuments({
        organization: organizationId,
        status: "delayed",
      }),

      Task.countDocuments({
        organization: organizationId,
      }),

      Task.countDocuments({
        organization: organizationId,
        status: "completed",
      }),

      Task.countDocuments({
        organization: organizationId,
        status: "pending",
      }),

      Task.countDocuments({
        organization: organizationId,
        status: "in_progress",
      }),

      Membership.countDocuments({
        organization: organizationId,
        status: "active",
      }),
    ]);

    const projects = await Project.find({
      organization: organizationId,
    }).select(
      "name status progress deadline budget revenue expense manager team",
    );

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({
          organization: organizationId,
          project: project._id,
        }).select("status");

        const progress = calculateProgress(tasks);

        if (project.progress !== progress) {
          project.progress = progress;

          if (progress === 100 && project.status !== "cancelled") {
            project.status = "completed";
          } else if (progress < 100 && project.status === "completed") {
            project.status = "running";
          }

          await project.save();
        }

        return project;
      }),
    );

    const totalBudget = projectsWithProgress.reduce(
      (total, project) => total + (project.budget || 0),
      0,
    );

    const totalRevenue = projectsWithProgress.reduce(
      (total, project) => total + (project.revenue || 0),
      0,
    );

    const totalExpense = projectsWithProgress.reduce(
      (total, project) => total + (project.expense || 0),
      0,
    );

    const profit = totalRevenue - totalExpense;

    const taskCompletionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const averageProjectProgress =
      projectsWithProgress.length > 0
        ? Math.round(
            projectsWithProgress.reduce(
              (total, project) => total + (project.progress || 0),
              0,
            ) / projectsWithProgress.length,
          )
        : 0;

    res.json({
      stats: {
        projects: {
          total: totalProjects,
          new: newProjects,
          running: runningProjects,
          completed: completedProjects,
          cancelled: cancelledProjects,
          delayed: delayedProjects,
        },

        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completionRate: taskCompletionRate,
        },

        team: {
          activeMembers,
        },

        financial: {
          budget: totalBudget,
          revenue: totalRevenue,
          expense: totalExpense,
          profit,
        },

        averageProjectProgress,
      },

      projects: projectsWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDashboard = async (req, res, next) => {
  try {
    const organizationId = req.orgId;
    const userId = req.user._id;

    const membership = await Membership.findOne({
      user: userId,
      organization: organizationId,
      status: "active",
    });

    if (!membership) {
      return res.status(403).json({
        message: "Active workspace membership required",
      });
    }

    let projects = [];

    if (membership.role === "admin") {
      projects = await Project.find({
        organization: organizationId,
      })
        .populate("manager", "name email")
        .populate("team", "name email")
        .sort({ createdAt: -1 });
    } else if (membership.role === "manager") {
      projects = await Project.find({
        organization: organizationId,
        manager: userId,
      })
        .populate("manager", "name email")
        .populate("team", "name email")
        .sort({ createdAt: -1 });
    } else {
      const tasks = await Task.find({
        organization: organizationId,
        assignedTo: userId,
      }).select("project");

      const projectIds = [
        ...new Set(tasks.map((task) => task.project.toString())),
      ];

      projects = await Project.find({
        organization: organizationId,
        _id: { $in: projectIds },
      })
        .populate("manager", "name email")
        .populate("team", "name email")
        .sort({ createdAt: -1 });
    }

    const projectData = await Promise.all(
      projects.map(async (project) => {
        const projectTasks = await Task.find({
          organization: organizationId,
          project: project._id,
        }).select("status assignedTo priority dueDate");

        const progress = calculateProgress(projectTasks);

        if (project.progress !== progress) {
          project.progress = progress;

          if (progress === 100 && project.status !== "cancelled") {
            project.status = "completed";
          } else if (progress < 100 && project.status === "completed") {
            project.status = "running";
          }

          await project.save();
        }

        const myTasks = projectTasks.filter(
          (task) => task.assignedTo?.toString() === userId.toString(),
        );

        return {
          project,
          progress,
          totalTasks: projectTasks.length,
          completedTasks: projectTasks.filter(
            (task) => task.status === "completed",
          ).length,
          myTasks: myTasks.length,
        };
      }),
    );

    const myTasks = await Task.find({
      organization: organizationId,
      assignedTo: userId,
    })
      .populate("project", "name status deadline progress")
      .sort({ createdAt: -1 });

    const completedMyTasks = myTasks.filter(
      (task) => task.status === "completed",
    ).length;

    const myTaskCompletionRate =
      myTasks.length > 0
        ? Math.round((completedMyTasks / myTasks.length) * 100)
        : 0;

    res.json({
      role: membership.role,

      stats: {
        projects: projectData.length,

        tasks: myTasks.length,

        completedTasks: completedMyTasks,

        taskCompletionRate: myTaskCompletionRate,
      },

      projects: projectData,

      tasks: myTasks,
    });
  } catch (error) {
    next(error);
  }
};

const calculateProgress = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  return Math.round((completedTasks / tasks.length) * 100);
};

export default calculateProgress;

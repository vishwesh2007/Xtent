import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRedirect from "@/routes/RoleRedirect";

import DashboardLayout from "@/layouts/DashboardLayout";

import Login from "@/pages/public/Login";
import Register from "@/pages/public/Register";

import Workspaces from "@/pages/onboarding/Workspaces";
import CreateWorkspace from "@/pages/onboarding/CreateWorkspace";
import JoinWorkspace from "@/pages/onboarding/JoinWorkspace";
import PendingApproval from "@/pages/onboarding/PendingApproval";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import Members from "@/pages/admin/Members";
import JoinRequests from "@/pages/admin/JoinRequests";
import WorkspaceSettings from "@/pages/admin/WorkspaceSettings";
import Projects from "@/pages/admin/Projects";
import ProjectDetails from "@/pages/admin/ProjectDetails";
import Tasks from "@/pages/admin/Tasks";
import Analytics from "@/pages/admin/Analytics";
import AIInsights from "@/pages/admin/AIInsights";

import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import MyProjects from "@/pages/manager/MyProjects";
import ManagerProjectDetails from "@/pages/manager/ProjectDetails";
import Team from "@/pages/manager/Team";

import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import MyTasks from "@/pages/employee/MyTasks";
import TaskDetails from "@/pages/employee/TaskDetails";
import Notifications from "@/pages/employee/Notifications";
import Performance from "@/pages/employee/Performance";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/redirect"
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireWorkspace={false}>
              <CreateWorkspace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspaces"
          element={
            <ProtectedRoute requireWorkspace={false}>
              <Workspaces />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-workspace"
          element={
            <ProtectedRoute requireWorkspace={false}>
              <CreateWorkspace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/join-workspace"
          element={
            <ProtectedRoute requireWorkspace={false}>
              <JoinWorkspace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending"
          element={
            <ProtectedRoute requireWorkspace={false}>
              <PendingApproval />
            </ProtectedRoute>
          }
        />

        <Route element={<DashboardLayout />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/members"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Members />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/join-requests"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <JoinRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/projects/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tasks"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/ai-insights"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AIInsights />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <WorkspaceSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/projects"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <MyProjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/projects/:id"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerProjectDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/team"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <Team />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ai-insights"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AIInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <MyTasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/tasks/:id"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <TaskDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/notifications"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/performance"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <Performance />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

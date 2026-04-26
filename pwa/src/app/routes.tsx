import { Navigate, createBrowserRouter } from "react-router";
import { Login } from "./components/auth/Login";
import { InvitationSignup } from "./components/auth/InvitationSignup";
import { ResetPassword } from "./components/auth/ResetPassword";

import { CoordinatorLayout } from "./components/coordinator/CoordinatorLayout";
import { Dashboard } from "./components/coordinator/Dashboard";
import { Schedules } from "./components/coordinator/Schedules";
import { CreateSchedule } from "./components/coordinator/CreateSchedule";
import { AvailabilityCollection } from "./components/coordinator/AvailabilityCollection";
import { ScheduleEditor } from "./components/coordinator/ScheduleEditor";
import { SwapApprovals } from "./components/coordinator/SwapApprovals";
import { LeaveRequests } from "./components/coordinator/LeaveRequests";
import { Doctors } from "./components/coordinator/Doctors";
import { Metrics } from "./components/coordinator/Metrics";
import { Audit } from "./components/coordinator/Audit";

import { DoctorLayout } from "./components/doctor/DoctorLayout";
import { DoctorDashboard } from "./components/doctor/DoctorDashboard";
import { MyAvailability } from "./components/doctor/MyAvailability";
import { MySchedule } from "./components/doctor/MySchedule";
import { SwapRequest } from "./components/doctor/SwapRequest";
import { SwapApproval } from "./components/doctor/SwapApproval";
import { DoctorLeaveRequests } from "./components/doctor/DoctorLeaveRequests";

import { AdminLayout } from "./components/admin/AdminLayout";
import { Users } from "./components/admin/Users";
import { Departments } from "./components/admin/Departments";
import { SystemSettings } from "./components/admin/SystemSettings";
import { ComplianceAudit } from "./components/admin/ComplianceAudit";
import { NotFound } from "./components/NotFound";
import { doctorSwapFlowEnabledFixture } from "../fixtures/schedules.fixture";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/signup",
    element: <InvitationSignup />,
  },
  {
    path: "/auth/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/coordinator",
    element: <CoordinatorLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "schedules", element: <Schedules /> },
      { path: "schedules/create", element: <CreateSchedule /> },
      { path: "schedules/:id/availability", element: <AvailabilityCollection /> },
      { path: "schedules/:id/editor", element: <ScheduleEditor /> },
      { path: "swaps", element: <SwapApprovals /> },
      { path: "leave-requests", element: <LeaveRequests /> },
      { path: "doctors", element: <Doctors /> },
      { path: "metrics", element: <Metrics /> },
      { path: "audit", element: <Audit /> },
    ],
  },
  {
    path: "/doctor",
    element: <DoctorLayout />,
    children: [
      { index: true, element: <DoctorDashboard /> },
      { path: "availability", element: <MyAvailability /> },
      { path: "schedule", element: <MySchedule /> },
      {
        path: "swap-request",
        element: doctorSwapFlowEnabledFixture ? <SwapRequest /> : <Navigate to="/doctor/schedule" replace />,
      },
      {
        path: "swap-approval/:id",
        element: doctorSwapFlowEnabledFixture ? <SwapApproval /> : <Navigate to="/doctor/schedule" replace />,
      },
      { path: "leave-requests", element: <DoctorLeaveRequests /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Users /> },
      { path: "departments", element: <Departments /> },
      { path: "settings", element: <SystemSettings /> },
      { path: "audit", element: <ComplianceAudit /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

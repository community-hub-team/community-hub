import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthRoute from "./components/AuthRoute.jsx";

import AuthCallback from "./pages/AuthCallback.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import HomeRender from "./pages/homePage/HomeRender.jsx";
import ProfileRender from "./pages/profilePage/ProfileRender.jsx";
import TasksRender from "./pages/tasksPage/TasksRender.jsx";
import TaskInfo from "./pages/tasksPage/TasksInfo.jsx";
import TeamsRender from "./pages/teamsPage/teamsRender.jsx";
import SettingsRender from "./pages/settingsPage/settingsRender.jsx";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Auth-only routes */}
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomeRender />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileRender />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksRender />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamsRender />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsRender />
            </ProtectedRoute>
          }
        />

        {/* Default routes */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </UserProvider>
  );
}

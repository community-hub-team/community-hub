import { useUser } from "../context/UserContext.jsx";
import { Navigate } from "react-router-dom";

export default function AuthRoute({ children }) {
  const { user, loading } = useUser();

  // Wait for session restore
  if (loading) return <div>Loading...</div>;

  // If already logged in, go to home
  if (user) return <Navigate to="/home" replace />;

  return children;
}

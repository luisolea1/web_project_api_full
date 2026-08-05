import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  loggedIn,
  isCheckingToken,
}) {
  if (isCheckingToken) {
    return null;
  }

  if (!loggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;
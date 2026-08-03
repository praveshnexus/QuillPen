import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PublicRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
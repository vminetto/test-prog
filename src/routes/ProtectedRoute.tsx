import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth";

type Props = {
  children?: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, bootstrapped } = useAuth();
  const location = useLocation();

  if (!bootstrapped) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}

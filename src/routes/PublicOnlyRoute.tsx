import { Navigate, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth";

type Props = {
  children?: ReactNode;
};

export default function PublicOnlyRoute({ children }: Props) {
  const { isAuthenticated, bootstrapped } = useAuth();

  if (!bootstrapped) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

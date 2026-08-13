import { Navigate } from "react-router-dom";
  import { DashboardPage } from "@/pages";
  import { DashboardLayout } from "@/layouts/dashboard-layout";
  import { useAuth } from "@/hooks";
  import { ROLES } from "@/constants/roles";

  export function DashboardRoute() {

      const { user } = useAuth();

      if (user?.roleName === ROLES.PRODUCTION) {
          return <Navigate to="/parts" replace />;
      }

      return (
          <DashboardLayout>
              <DashboardPage />
          </DashboardLayout>
      );

  }
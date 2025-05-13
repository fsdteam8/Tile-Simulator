import React, { ReactNode } from "react";
import DashboardSidebar from "./_components/dashboard-sidebar";
import DashboardNavbar from "./_components/dashboard-navbar";
import AuthWrapper from "@/components/provider/AuthWrapper";

const AdminDashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthWrapper>
      <div className="bg-white w-full ">
        <DashboardNavbar />
        <div className="w-full h-full flex justify-start items-start">
          <DashboardSidebar />
          <div className="w-full pl-7 pr-8 pt-6">{children}</div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default AdminDashboardLayout;

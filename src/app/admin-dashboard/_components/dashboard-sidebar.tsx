"use client";
import { Sidebarcontents } from "@/data/admin-dashboard-data";
import React, { useState } from "react";
import DashboardSidebarItem from "./dashboard-sidebar-item";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import LogoutModal from "@/components/shared/modal/LogoutModal";
import { toast } from "react-toastify";

const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      toast.success("You have successfully logged out!"); // Show toast first

      setTimeout(async () => {
        await signOut({ callbackUrl: "/login" }); // Redirect after toast is shown
      }, 2000); // Wait for 2 seconds to let toast appear
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again."); // Show error toast
    }
  };

  return (
    <>
      <div className="w-[300px] max-w-[354px] h-screen bg-white shadow-[4px_0px_10px_0px_rgba(0,0,0,0.25)] pl-7 sticky top-0 z-50 -mt-[86px] flex flex-col">
        <div>
          <div className="pt-[30px]">
            <Link href="/">
              <Image
                src="/assets/lili_logo.png"
                alt="logo"
                width={184}
                height={82}
              />
            </Link>
          </div>
          <div className="mt-[70px]">
            {Sidebarcontents?.map((item) => (
              <DashboardSidebarItem key={item?.id} item={item} />
            ))}
          </div>
        </div>
        <div className="mt-auto pb-10">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-4 text-lg font-medium text-black leading-[120%] shadow-none border-none mb-4"
          >
            <Settings /> Setting
          </Button>
          <Button
            onClick={() => setIsOpen(true)}
            variant="ghost"
            className="w-full flex items-center justify-start gap-4 text-lg font-medium text-black leading-[120%] shadow-none border-none "
          >
            <LogOut /> Log out
          </Button>
        </div>

        {/* log out modal  */}
        {isOpen && (
          <LogoutModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handleLogout}
          />
        )}
      </div>
    </>
  );
};

export default DashboardSidebar;

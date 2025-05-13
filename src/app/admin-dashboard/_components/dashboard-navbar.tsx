
import getCurrentUser from "@/lib/session";
import Image from "next/image";
import React from "react";
import { FaRegBell } from "react-icons/fa6";

const DashboardNavbar = async () => {
  const user = await getCurrentUser();
  return (
    <div className="h-[86px] flex items-center bg-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] pr-[32px]">
      <div className="w-full flex items-center justify-end gap-8">
        <div className="flex items-center ">
          <FaRegBell className="w-[18px] h-[18px] " />{" "}
          <sup className="text-[10px] font-semibold leading-[136%] text-white bg-primary py-[2px] px-[6px] rounded-full -mt-3 -ml-2">
            2
          </sup>
        </div>
        <div className="flex items-center gap-3">
          <Image src="/assets/user.png" alt="user" width={32} height={32} />
          <div>
            <h4 className="text-sm font-medium leading-[20px] text-black">
              {user?.name}
            </h4>
            <p className="text-xs font-medium leading-[18px] text-black">
              Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;

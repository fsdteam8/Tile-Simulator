import Image from "next/image";
import Link from "next/link";
import React from "react";
import Hideon from "../../../../provider/Hideon";

async function Header() {
  return (
    <Hideon routes={["/admin-dashboard"]}>
      <div className="bg-[#000000]/50 ">
        <div className="container flex justify-between items-center py-4 px-8">
          <div>
            <Link href="/">
              <Image src="/assets/logo.png" alt="logo" width={48} height={48} className="w-[32px] h-[32px]"/>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://lilitile.com/pages/create-your-custom-tiles">
              <button className="text-sm lg:text-base fotn-medium bg-primary text-white leading-[120%] p-2 lg:py-[12px] lg:px-[38px] rounded-[8px] cursor-pointer">
                Shop Now
              </button>
            </Link>

            <button className="text-sm lg:text-base fotn-medium text-white leading-[120%] p-[6px] lg:py-[12px] lg:px-[35px] rounded-[8px] border border-white cursor-pointer">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </Hideon>
  );
}

export default Header;

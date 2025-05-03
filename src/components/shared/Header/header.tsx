import Image from "next/image";
import Link from "next/link";
import React from "react";
import Hideon from "../../../../provider/Hideon";

async function Header() {
  return (
    <Hideon routes={["/admin-dashboard"]}>
      <div className="bg-[#000000]/50">
        <div className="container flex justify-between items-center py-2 2xl:py-4 px-8 ">
          <div>
            <Link href="/">
              <Image
                src="/assets/logo.png"
                alt="logo"
                width={48}
                height={48}
                className="w-[32px] h-[32px] xl:w-10 xl:h-10 2xl:w-[52px] 2xl:h-[52px]"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://lilitile.com/pages/create-your-custom-tiles">
              <button className="text-sm lg:text-base fotn-medium bg-primary text-white leading-[120%] py-[7px] md:py-[6px] 2xl:py-[12px] px-[22px] md:px-[26px] lg:px-[30px] xl:px-[34px] 2xl:px-[38px] rounded-[8px] cursor-pointer">
                Shop Now
              </button>
            </Link>

            <button className="text-sm lg:text-base fotn-medium text-white leading-[120%] py-[6px] 2xl:py-[12px] px-[19px] md:px-[23px] lg:px-[27px] xl:px-[31px] 2xl:px-[35px] rounded-[8px] border border-white cursor-pointer">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </Hideon>
  );
}

export default Header;

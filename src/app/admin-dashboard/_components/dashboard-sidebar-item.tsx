"use client"
import { SidebarContentType } from '@/data/admin-dashboard-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const DashboardSidebarItem = ({item}: {item : SidebarContentType}) => {
    const pathName = usePathname();
    const isActive = pathName === item?.href;
    return (
        <div>
            <Link className={cn(`flex items-center justify-start gap-4 p-4 text-lg font-medium leading-[120%] mb-4  ${isActive ? "bg-primary text-white rounded-[4px] border-r-[4px] border-primary-50" : "bg-transparent text-black" }`)} href={item?.href}>{item?.icon} {item?.name}</Link>
        </div>
    );
};

export default DashboardSidebarItem;
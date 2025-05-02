import { MdOutlineShoppingBag } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { AiOutlineBars } from "react-icons/ai";

import { ReactNode } from "react";

export type SidebarContentType = {
    id: number;
    name: string;
    icon: ReactNode;
    href: string;
};

export const Sidebarcontents: SidebarContentType[] = [
    {
        id: 1,
        name: "All Tiles",
        icon: <MdOutlineShoppingBag className="w-4 h-4"/>, 
        href: "/admin-dashboard",
    },
    {
        id: 2,
        name: "Tile Categories",
        icon: <AiOutlineBars className="w-4 h-4"/>, 
        href: "/admin-dashboard/tile-categories",
    },
    {
        id: 3,
        name: "tile Color",
        icon: <IoCartOutline className="w-4 h-4"/>, 
        href: "/admin-dashboard/tile-color",
    },
    {
        id: 4,
        name: "Submission",
        icon: <FiUsers className="w-4 h-4"/>, 
        href: "/admin-dashboard/submission",
    },
];

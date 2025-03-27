"use client";

import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import TileDetails from "./TileDetails";



//eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuctionButton = ({ row } : any) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  console.log({row})

  const handleEditTiles = (id : number) => {
    router.push(`/admin-dashboard/edit-new-tile/${id}`);
  };

  return (
    <div>
      <div className="w-full flex justify-center items-center gap-[10px]">
        <button onClick={()=> setIsOpen(true)}>
          <Eye className="w-5 h-5 cursor-pointer" />
        </button>
        <button onClick={() => handleEditTiles(row?.original?.id)}>
          <FiEdit className="w-5 h-5 cursor-pointer" />
        </button>
        <button>
          <Trash2 className="w-5 h-5 hover:text-primary cursor-pointer" />
        </button>
      </div>

    {/* Tile Details data modal  */}
    {
      isOpen && (
        <TileDetails open={isOpen} onOpenChange={setIsOpen} row={row}/>
      )
    }

    </div>
  );
};

export default AuctionButton;

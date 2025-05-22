import React from "react";
// Make sure the path is correct; update if necessary
// Update the import path below if EditNewTile is in a different folder
const EditNewTile = dynamic(() => import("../EditNewTile"), {
  ssr: false,
});
// import EditNewTile from "../EditNewTile";

import EditTileHeader from "../EditTileHeader";
import dynamic from "next/dynamic";

interface Params {
  id: string | number;
}
const Page = ({ params }: { params: Params }) => {
  return (
    <div>
      <EditTileHeader />
      <EditNewTile id={params.id} />
    </div>
  );
};

export default Page;

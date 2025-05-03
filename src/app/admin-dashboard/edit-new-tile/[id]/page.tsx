import React from "react";
import EditNewTile from "../EditNewTile";
import EditTileHeader from "../EditTileHeader";

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

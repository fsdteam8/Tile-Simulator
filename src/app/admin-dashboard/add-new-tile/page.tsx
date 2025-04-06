import React from 'react';
import AddNewTile from './_components/AddNewTile';
import AddNewTileHeader from './_components/AddNewTileHeader';
// import ZabeerUpload from './_components/AddNewTile2';

const Page = () => {
    return (
        <div>
            <AddNewTileHeader/>
            <AddNewTile/>
            {/* <ZabeerUpload/> */}
        </div>
    );
};

export default Page;
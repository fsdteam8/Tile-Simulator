import React from 'react';
const AddNewTile = dynamic(() => import('./_components/AddNewTile'), {
    ssr: false,
});
// import AddNewTile from './_components/AddNewTile';
const AddNewTileHeader = dynamic(() => import('./_components/AddNewTileHeader'), {
    ssr: false,
});
// import AddNewTileHeader from './_components/AddNewTileHeader';
import dynamic from 'next/dynamic';

const Page = () => {
    return (
        <div>
            <AddNewTileHeader/>
            <AddNewTile/>
        </div>
    );
};

export default Page;
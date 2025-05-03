"use client"
import React from 'react';
import AllTilesContainer from './_components/AllTilesContainer';
import AllTilesHeader from './_components/AllTilesHeader';
import { useSearchTile } from '@/components/zustand/allTiles/allTiles';

const Page = () => {
    const { search, setSearch } = useSearchTile();
    return (
        <div>
            <AllTilesHeader search={search} setSearch={setSearch}/>
            <AllTilesContainer search={search}/>
        </div>
    );
};

export default Page;
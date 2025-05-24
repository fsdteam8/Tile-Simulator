import React from 'react'
import dynamic from 'next/dynamic';
const Tiles = dynamic(() => import('./tile-simulator'), {
  ssr: false,
});

const page = () => {
  return (
    <div>
      <Tiles />
    </div>
  )
}

export default page
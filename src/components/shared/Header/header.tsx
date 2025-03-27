import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Hideon from '../../../../provider/Hideon'

async function Header() {
    return (
        <Hideon routes={["/admin-dashboard"]}>
            <div className='bg-[#000000]/50'>
                <div className='max-w-[96%] mx-auto flex justify-between items-center py-4 px-8'>
                    <div>
                        <Link href="/">
                        <Image src="/assets/logo.png" alt="logo" width={48} height={48} />
                        </Link>
                    </div>
                    <div>
                        <Link href='#'><Button>Shop Now</Button></Link>
                    </div>
                </div>
            </div>

        </Hideon>
    )
}

export default Header
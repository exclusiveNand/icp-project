import React from 'react';
import Aside from './components/dashboard/aside';
import Navbar from './components/dashboard/navbar';

const AdminPage = (props) => {
    return (
        <>
            <div className="flex text-white">
                <div className="bg-[#0e0e0e] h-screen fixed w-64 border-r-[1px] border-r-[#0d0101] md:block hidden">
                    <div className='overflow-auto h-screen sticky top-0 hide-scrollbar'>
                        <Aside />
                    </div>
                </div>
                <div className='md:ml-64 w-full'>
                    <Navbar />
                    <div className='mx-4'>
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminPage;
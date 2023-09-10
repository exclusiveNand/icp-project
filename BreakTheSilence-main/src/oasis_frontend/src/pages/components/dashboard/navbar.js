import React, { useContext, useEffect, useState } from 'react';
import { BsFillBellFill } from 'react-icons/bs'
import { AiOutlineCaretDown, AiOutlineMenu } from 'react-icons/ai'
import { GlobalContext } from '../../../context/global-context';
import { Avatar, Drawer, Dropdown, Popover } from 'antd';
import Notifications from '../notifications';
import { Link } from 'react-router-dom';
import Aside from './aside';
const Navbar = () => {
    const { PageTitle, NotificationsPanel, Storage, drawer } = useContext(GlobalContext);
    const [profilePic, setProfilePic] = useState('User');
    const [displayName, setDisplayName] = useState('...');

    useEffect(() => {
        setDisplayName(Storage.user.get.phone);
        if (Storage.user.get.userData) {
            //check if the count is greater than 0
            if (Object.keys(Storage.user.get.userData).length > 0) {
                if (Storage.user.get.userData.firstName) {
                    setProfilePic(Storage.user.get.userData.firstName.charAt(0).toUpperCase());
                    setDisplayName(Storage.user.get.userData.firstName + " " + Storage.user.get.userData.lastName);
                }
            }
        }
    }, [Storage.user.get]);

    const items = [
        {
            label: <><Notifications /></>,
            onClick: () => console.log('Notification 1 Clicked'),
            key: '1',
        },
    ];
    return (
        <>
            <nav className='flex my-6 items-center mx-5 justify-between text-white'>
                <div className='flex gap-10'>
                    <div className='text-xl font-bold flex items-center gap-2'>
                        <div className='p-2 md:hidden rounded-md cursor-pointer' onClick={() => drawer.put()}>
                            <AiOutlineMenu />
                        </div>
                        <span className='text-[#fe570b]'>{PageTitle.title}</span>
                    </div>
                </div>
                <div className='flex mr-7 gap-3 items-center'>
                    <Popover
                        placement='bottomRight'
                        open={NotificationsPanel.visibility}
                        onClick={() => NotificationsPanel.toggle()}
                        content={<Notifications />}
                        trigger='click'
                    >
                        <div className='p-2 hover:bg-[#222222] rounded-full cursor-pointer duration-200 ease-in-out'>
                            <BsFillBellFill />
                        </div>
                    </Popover>
                    <Link className='flex items-center gap-3' to={'/dashboard'}>
                        <Avatar gap={4} className='cursor-pointer' style={{ backgroundColor: '#fe570b' }}>{profilePic}</Avatar>
                        <div className=''>{displayName}</div>
                        <AiOutlineCaretDown />
                    </Link>
                </div>
            </nav>
            <Drawer closable={false} onClose={() => drawer.remove()} width={'auto'} style={{ margin: "0px 0px 0px 0px", padding: "0px 0px 0px 0px", backgroundColor: "#0e0e0e" }} placement="left" open={drawer.reveal}>
                <div className='bg-[#0e0e0e] left-1 border-r-[#0e0e0e] h-screen fixed top-0 bottom-0'>
                    <Aside />
                </div>
            </Drawer>
        </>
    )
}

export default Navbar;
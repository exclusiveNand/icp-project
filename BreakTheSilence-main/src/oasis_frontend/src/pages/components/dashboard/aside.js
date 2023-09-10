import React, { useContext, useEffect, useRef, useState } from 'react';
import logo from '../../../assets/Logo.svg'
import { FaHome } from 'react-icons/fa'
import { MdOutlineAdminPanelSettings, MdOutlineNoteAdd } from 'react-icons/md'
import { BiSupport } from 'react-icons/bi'
import { RiUserSettingsLine } from 'react-icons/ri'
import { TbLogout } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineFileText, AiOutlineClose } from 'react-icons/ai';
import { GlobalContext } from '../../../context/global-context';
import { Popconfirm } from 'antd';
import { oasis_backend } from '../../../../../declarations/oasis_backend';


const Aside = () => {
    const { Aside, Storage, Admin, drawer } = useContext(GlobalContext);
    const isMounted = useRef(false);
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('auth');
        navigate('/auth');
    }
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        }
    }, [Storage.user.get])
    return (
        <>
            <div className='my-6 text-[#fff]'>
                <div className='w-48 h-auto mx-2 flex justify-between items-center'>
                    <Link to={'/dashboard'} className='flex justify-center w-full'><img className='w-24' src={logo} /></Link>
                    <div className='mr-3 md:hidden p-2 rounded-md cursor-pointer' onClick={() => drawer.remove()}>
                        <AiOutlineClose className='text-xl' />
                    </div>
                </div>
                <div className='flex flex-col gap-9 mt-8 justify-between h-[65dvh]'>
                    <div className='flex flex-col justify-between'>
                        <div className='flex flex-col gap-3'>
                            <Link to="/dashboard" className={`hover:bg-[#0d0101] p-2 duration-200 ease-in-out border-l-[3px] border-transparent ${Aside.active == "dashboard" && "aside-active"}`}>
                                <div className='flex items-center gap-2 ml-2'>
                                    <FaHome />
                                    Dashboard
                                </div>
                            </Link>
                            <Link className={`hover:bg-[#0d0101] p-2 duration-200 ease-in-out border-l-[3px] border-transparent ${Aside.active == "reported-cases" && "aside-active"}`} to="/dashboard/reported-cases">
                                <div className='flex items-center gap-2 ml-2'>
                                    <AiOutlineFileText />
                                    Reported Cases
                                </div>
                            </Link>
                            <Link className={`hover:bg-[#0d0101] p-2 duration-200 ease-in-out border-l-[3px] border-transparent ${Aside.active == "abuse-form" && "aside-active"}`} to="/dashboard/abuse-form">
                                <div className='flex items-center gap-2 ml-2'>
                                    <MdOutlineNoteAdd />
                                    Submit your statement
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col h-[15dvh] justify-end gap-3'>
                    {(Admin.status.get && Admin.status.get != 'deny') && <Link className={`hover:bg-[#0d0101] p-2 duration-200 ease-in-out border-l-[3px] border-transparent ${Aside.active == "admin" && "aside-active"}`} to="/dashboard/admin">
                        <div className='flex items-center gap-2 ml-2'>
                            <MdOutlineAdminPanelSettings />
                            Admin
                        </div>
                    </Link>}
                    <Popconfirm placement='rightBottom' title="Are you sure to logout?" onConfirm={() => logout()}>
                        <div className='hover:bg-[#0d0101] p-2 duration-200 ease-in-out border-l-[3px] border-transparent cursor-pointer flex items-center gap-2 ml-2'>
                            <TbLogout />
                            Logout
                        </div>
                    </Popconfirm>
                </div>

            </div>
        </>
    )
}

export default Aside;
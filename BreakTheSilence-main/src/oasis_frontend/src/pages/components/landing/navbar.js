import React from 'react';
import logo from '../../../assets/Logo.svg'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
            <nav className='flex mt-6 items-center mx-5 justify-between'>
                <div className='flex gap-10'>
                    <Link to="/"><img className='lg:w-36 h-fit lg:mt-1 lg:mx-10' src={logo} /></Link>
                </div>
                <div className='flex lg:mr-7 gap-3 lg:gap-6 items-center'>
                    <Link to="/auth"><div className='text-sm font-bold text-white'>Login</div></Link>
                    <Link to="/auth"><button className='bg-[#fe570b] text-sm text-white font-bold px-2 py-1 lg:px-5 lg:py-2 rounded-full'>Sign up</button></Link>
                </div>
            </nav>
        </>
    )
}
export default Navbar;
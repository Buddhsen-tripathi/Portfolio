import React, { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-scroll' 
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom'; 
import Logo from '../assets/logo-white-256x256.webp';

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const location = useLocation();  

    const toggleNav = () => {
        setNav(!nav);
    };

    const closeNav = () => {
        setNav(false);
    };

    const menuVariants = {
        open: {
            x: 0,
            transition: {
                stiffness: 20,
                damping: 15
            }
        },
        closed: {
            x: '-100%',
            transition: {
                stiffness: 20,
                damping: 15
            }
        }
    };

    // Check if we're on the blogs page
    const isBlogPage = location.pathname === '/blogs';

    return (
        <div className='fixed top-0 left-0 w-full bg-opacity-70 backdrop-blur-md z-50'>
            <div className='max-w-[1200px] mx-auto flex justify-between text-gray-200 text-xl items-center px-8 h-24'>
                <a href="/"><img src={Logo} className="logo" alt="Logo" /></a>

                {!isBlogPage && (
                    <ul className='hidden md:flex gap-12 z-10 cursor-pointer'>
                        <li><Link to="project" offset={-120} smooth="true" duration={400}>Projects</Link></li>
                        <li><Link to="recentblogs" offset={-150} smooth="true" duration={400}>Blogs</Link></li>
                        <li><Link to="contact" offset={50} smooth="true" duration={400}>Contact</Link></li>
                    </ul>
                )}

                <div onClick={toggleNav} className='md:hidden z-50 text-gray-200'>
                    {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
                </div>

                {!isBlogPage && (
                    <motion.div
                        initial={false}
                        animate={nav ? 'open' : 'closed'}
                        variants={menuVariants}
                        className='fixed left-0 top-0 w-full min-h-screen bg-gray-900 z-40'
                    >
                        <ul className='font-semibold text-4xl space-y-8 mt-24 text-center'>
                            <li><Link to="project" onClick={closeNav} offset={-70} smooth={true} duration={500}>Projects</Link></li>
                            <li><Link to="recentblogs" onClick={closeNav} smooth={true} offset={-100} duration={500}>Blogs</Link></li>
                            <li><Link to="contact" onClick={closeNav} smooth={true} duration={500}>Contact</Link></li>
                        </ul>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Navbar;

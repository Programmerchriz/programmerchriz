import { NAV_LINKS } from '@/constants/constants';
import Link from 'next/link';
import React from 'react';
import { CgClose } from 'react-icons/cg';

type MobileNavProps = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({
  showNav,
  closeNav,
}: MobileNavProps) => {
  const navOpen = showNav ? 'translate-x-0' : 'translate-x-[100%]';

  return (
    <div>
      {/* Overlay */}
      <div className={`fixed inset-0 ${navOpen} transform transition-all right-0 duration-500 z-100002 bg-black opacity-70 w-full h-screen`}
      ></div>

      {/* Nav Links */}
      <div
        className={`fixed ${navOpen} flex flex-col justify-center h-full text-white transition-all duration-500 delay-300 w-[80%] sm:w-[60%] bg-cyan-800 space-y-6 z-100050 right-0`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            className='text-white w-fit text-xl ml-12 border-b-[1.5px] pb-1 border-white sm:text-[30px] font-medium transition-all duration-200'
          >
            <p>{link.label}</p>
          </Link>
        ))}
  
        {/* Close Button */}
        <CgClose
          onClick={closeNav}
          className='absolute top-[2.1rem] right-[1.4rem] sm:w-8 sm:h-8 w-6 h-6'
        />
      </div>
    </div>
  );
};

export default MobileNav;

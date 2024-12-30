import React, { useEffect, useState } from 'react';
import Logo from '../../assets/CPMS.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function LandingNavbar() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const [buttonSize, setButtonSize] = useState('lg');
  const [logoText, setLogoText] = useState('College Placement Management System');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    setLoading(false);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Detect screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setButtonSize('md'); // Set size 'sm' for max-md screens
        setLogoText('CPMS');
      } else if (window.innerWidth <= 768) {
        setButtonSize('md'); // Set size 'sm' for max-md screens
        setLogoText('College Placement Management System');
      } else {
        setButtonSize('lg'); // Set size 'lg' for larger screens
        setLogoText('College Placement Management System');
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize); // Update size on window resize

    return () => window.removeEventListener('resize', handleResize);
  }, [window.innerWidth]);

  return (
    <>
      {
        loading ? (
          <div className="">Loading...</div>
        ) : (
          <>
            <div className={`flex justify-between items-center playfair transition-all duration-200 ease-in z-50 ${isScrolled && 'shadow-lg bg-slate-50 top-0 sticky'}`}>
              <div className='flex items-center my-2 mx-3 p-1 gap-3 max-sm:my-0.5 max-sm:mx-1'>
                <img
                  src={Logo}
                  alt="Logo"
                  className='rounded-lg border border-black w-20 h-20 max-md:w-16 max-md:h-16 max-sm:w-12 max-sm:h-12'
                />
                <h1 className={`text-4xl max-md:text-2xl max-sm:text-lg ${logoText === 'CPMS' && '!text-3xl'}`}>
                  {logoText}
                </h1>
              </div>
              <div className='flex gap-3 p-1 mr-5 justify-center items-center'>
                <Button
                  variant="outline-primary"
                  size={buttonSize}
                  className=""
                  onClick={() => navigate('student/login')}
                >
                  Login
                </Button>

                <Button
                  variant="success"
                  size={buttonSize}
                  className="text-nowrap"
                  onClick={() => navigate('student/signup')}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </>
        )
      }
    </>
  )
}

export default LandingNavbar

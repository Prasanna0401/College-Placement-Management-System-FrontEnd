import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import axios from 'axios';
import Logo from '../assets/CPMS.png';
import SubMenu from './Submenu';
import { BASE_URL } from '../config/config';

const Sidebar = ({ isSidebarVisible }) => {
  const [sidebar, setSidebar] = useState(isSidebarVisible);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebar(isSidebarVisible);
  }, [isSidebarVisible]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (loadData.role === 'student') navigate('../student/login');
    else if (loadData.role === 'tpo_admin') navigate('../tpo/login');
    else if (loadData.role === 'management_admin') navigate('../management/login');
    else if (loadData.role === 'superuser') navigate('../admin');
  };

  const [loadData, setLoadData] = useState({
    name: 'Not Found',
    email: 'Not Found',
    profile: 'Profile Img',
    role: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setLoadData({
          name: `${res.data?.first_name} ${res.data?.middle_name} ${res.data?.last_name}`,
          email: res.data.email,
          profile: res.data.profile,
          role: res.data.role,
        });
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          const dataToPass = {
            showToastPass: true,
            toastMessagePass: err.response.data.msg,
          };
          navigate('../', { state: dataToPass });
        }
      });
  }, [navigate]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [SidebarData, setSidebarData] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const fetchSidebarData = async () => {
    if (loadData.role === 'superuser') {
      const { SidebarData } = await import('./SuperUser/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'management_admin') {
      const { SidebarData } = await import('./Management/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'tpo_admin') {
      const { SidebarData } = await import('./TPO/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'student') {
      const { SidebarData } = await import('./Students/SidebarData');
      setSidebarData(SidebarData);
    }
  };

  useEffect(() => {
    if (loadData.role) {
      fetchSidebarData();
    }
  }, [loadData.role]);


  return (
    <>
      <nav className={`bg-[#f2f2f2] w-[240px] min-h-screen h-full z-20 flex flex-col fixed top-0 transition-transform duration-300 ${sidebar ? 'translate-x-0' : '-translate-x-full'} shadow-md navbar-container lg:w-[260px]`}>
        {/* Main Sidebar Logo and Name */}
        <div className="flex items-center px-4 py-6 gap-3 bg-blue-50">
          <img className="rounded-xl shadow-md" src={Logo} alt="Logo Image" width="75" height="75" />
          <h1 className="text-2xl font-bold text-white">
            {loadData.role === 'superuser' && <Link to="/admin/dashboard" className="no-underline text-black">CPMS</Link>}
            {loadData.role === 'management_admin' && <Link to="/management/dashboard" className="no-underline text-black">CPMS</Link>}
            {loadData.role === 'tpo_admin' && <Link to="/tpo/dashboard" className="no-underline text-black">CPMS</Link>}
            {loadData.role === 'student' && <Link to="/student/dashboard" className="no-underline text-black">CPMS</Link>}
          </h1>
        </div>

        {/* Main body */}
        <div className="flex-grow overflow-y-auto sidebar-content pb-24">
          <div className="flex flex-col justify-center w-full">
            {SidebarData.length > 0 ? (
              SidebarData.map((item, index) => (
                <SubMenu item={item} key={index} currentPath={location.pathname} />
              ))
            ) : (
              <p className="text-center text-gray-600">Loading...</p>
            )}
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="bottom-0 absolute w-full transition-all duration-300">
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className={`w-full rounded-t-md bg-blue-200 ${dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-5'}`}>
              {/* Conditional rendering based on role */}
              {loadData.role === 'student' && (
                <Link to={`../student/account`} className="flex items-center rounded-t-md no-underline text-black p-3 hover:bg-blue-300">
                  <FaCog className="mr-2" /> <span>Account Details</span>
                </Link>
              )}
              {loadData.role === 'tpo_admin' && (
                <Link to={`../tpo/account`} className="flex items-center rounded-t-md no-underline text-black p-3 hover:bg-blue-300">
                  <FaCog className="mr-2" /> <span>Account Details</span>
                </Link>
              )}
              {loadData.role === 'management_admin' && (
                <Link to={`../management/account`} className="flex items-center rounded-t-md no-underline text-black p-3 hover:bg-blue-300">
                  <FaCog className="mr-2" /> <span>Account Details</span>
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center rounded-t-md w-full p-3 text-red-700 hover:bg-blue-300">
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}

          {/* User Profile */}
          <div className="flex justify-center items-center cursor-pointer bg-blue-100" onClick={toggleDropdown}>
            <img src={`${BASE_URL}${loadData.profile}`} alt="Profile Img" width="45px" className="mx-2 my-2 rounded-2xl transition-all duration-300 shadow-md" />
            <div className="w-full">
              <div className="flex flex-col justify-center py-1">
                <h2 className="text-base font-semibold">{loadData.name}</h2>
                <p className="text-sm text-gray-600">{loadData.email}</p>
              </div>
            </div>
            <div className="px-1">
              <IoIosArrowDropdownCircle size={24} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

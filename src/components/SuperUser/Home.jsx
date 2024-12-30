import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { BASE_URL } from '../../config/config';

function Home() {
  document.title = 'CPMS | Admin Dashboard';

  const [countUsers, setCountUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/all-users`);
        setCountUsers(response.data);
      } catch (error) {
        console.log("Home.jsx => ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      {
        loading ? (
          <div className="flex justify-center h-72 items-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl max-sm:text-2xl" />
          </div>
        ) : (
          <div className="mt-10">
            <div className="  flex flex-col gap-20 justify-center items-center flex-wrap">
              <div className="  w-full px-10 flex flex-wrap justify-evenly items-center gap-4">
                <Link className='text-black no-underline' to='../admin/management'>
                  <div className="bg-slate-300/30 shadow h-44 w-60 text-center flex flex-col justify-evenly items-center rounded-md cursor-pointer border-2 border-gray-600 transition-all ease-in-out hover:bg-slate-400/30  max-sm:h-32 max-sm:w-44">
                    <span className='text-3xl max-sm:text-2xl'>Management Admin</span>
                    <span className='text-3xl max-sm:text-2xl'>{countUsers.managementUsers}</span>
                  </div>
                </Link>
                <Link className='text-black no-underline' to='../admin/tpo'>
                  <div className="bg-slate-300/30 shadow h-44 w-60 text-center flex flex-col justify-evenly items-center rounded-md cursor-pointer border-2 border-gray-600 transition-all ease-in-out hover:bg-slate-400/30  max-sm:h-32 max-sm:w-44">
                    <span className='text-3xl max-sm:text-2xl'>TPO Admin</span>
                    <span className='text-3xl max-sm:text-2xl'>{countUsers.tpoUsers}</span>
                  </div>
                </Link>
                <Link className='text-black no-underline' to='../admin/student'>
                  <div className="bg-slate-300/30 shadow h-44 w-60 text-center flex flex-col justify-evenly items-center rounded-md cursor-pointer border-2 border-gray-600 transition-all ease-in-out hover:bg-slate-400/30  max-sm:h-32 max-sm:w-44">
                    <span className='text-3xl max-sm:text-2xl'>Student User</span>
                    <span className='text-3xl max-sm:text-2xl'>{countUsers.studentUsers}</span>
                  </div>
                </Link>
                <div className="bg-slate-300/30 shadow h-44 w-60 text-center flex flex-col justify-evenly items-center rounded-md cursor-pointer border-2 border-gray-600 transition-all ease-in-out hover:bg-slate-400/30  max-sm:h-32 max-sm:w-44">
                  <span className='text-3xl max-sm:text-2xl'>Superuser</span>
                  <span className='text-3xl max-sm:text-2xl'>{countUsers.superUsers}</span>
                </div>
              </div>
              {
                countUsers.studentApprovalPendingUsers !== 0 &&
                (
                  <div className="bg-red-500 rounded">
                    <Link className='text-black no-underline' to='../admin/approve-student'>
                      <div className="bg-slate-300/30 shadow h-44 w-80 text-center flex flex-col justify-evenly items-center rounded-md cursor-pointer border-2 border-gray-600 transition-all ease-in-out hover:bg-slate-400/30 max-sm:h-32 max-sm:w-56">
                        <span className='text-3xl max-sm:text-2xl'>
                          Student Approval Pending
                          <Badge bg="secondary" pill className='mx-2'>Action Needed</Badge>
                        </span>
                        <span className='text-3xl max-sm:text-2xl'>{countUsers.studentApprovalPendingUsers}</span>
                      </div>
                    </Link>
                  </div>
                )
              }

            </div>
          </div>
        )
      }
    </>
  )
}

export default Home

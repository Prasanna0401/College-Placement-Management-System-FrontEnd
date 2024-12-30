import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/config';

function NotificationBox() {
  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setCurrentUser({ role: response.data.role });
      } catch (error) {
        console.log("Error fetching user details => ", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [currentUser?.role]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`);
      // console.log(response.data.data)
      // retriving lastest post
      setJobs(response.data.data.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)).slice(0, 10));
    } catch (error) {
      console.log('Error while fetching notices => ', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="my-2 mx-2 w-full backdrop-blur-md bg-white/30 border border-white/20 rounded-lg py-2 px-3 shadow shadow-red-400">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold my-2">Notification</h3>
          {/* <span className=''>
            {
              currentUser?.role === 'student' && (
                <Link to='/student/all-notice' className='no-underline text-blue-500 hover:text-blue-700'>
                  View All
                </Link>
              )
            }
            {
              currentUser?.role === 'tpo_admin' && (
                <Link to='/tpo/all-notice' className='no-underline text-blue-500 hover:text-blue-700'>
                  View All
                </Link>
              )
            }
            {
              currentUser?.role === 'management_admin' && (
                <Link to='/management/all-notice' className='no-underline text-blue-500 hover:text-blue-700'>
                  View All
                </Link>
              )
            }
          </span> */}
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <i className="fa-solid fa-spinner fa-spin text-2xl" />
          </div>
        ) : (
          <div className="relative h-72 overflow-hidden">
            {/* Wrapping the notices in a div that handles the animation */}
            <div className="absolute bottom-0 w-full h-full animate-scrollUp">
              {jobs?.length > 0 ? (
                jobs.map((job, index) => (
                  <div key={index} className="py-2 h-fit">
                    <Link
                      className='text-blue-500 hover:text-blue-700'
                      to={`/student/job/${job?._id}`}
                      target="_blank"
                    >
                      {job?.jobTitle}
                      {/* Calculate the time difference in days and conditionally show the badge */}
                      {(new Date() - new Date(job?.postedAt)) / (1000 * 60 * 60 * 24) <= 2 && (
                        <Badge className="mx-2" bg="primary">New</Badge>
                      )}
                    </Link>
                    <span className='no-underline mx-1 text-gray-400'>
                      {new Date(job?.postedAt).toLocaleDateString('en-IN') + " " + new Date(job?.postedAt).toLocaleTimeString('en-IN')}
                    </span>
                  </div>
                ))
              ) : (
                <div>No notices found!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NotificationBox

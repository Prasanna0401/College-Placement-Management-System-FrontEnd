import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/config';

// for management adn tpo admins
function NotificationBox() {
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState([]);
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
    fetchUpdates();
  }, [currentUser?.role]);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/notify-interview-hired`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const students = response.data.studentsWithJobDetails;

      // Filtering students with 'interview' or 'hired' status
      const filteredJobs = students.map(student => {
        return {
          id: student._id,
          studentName: student.name,
          department: student.department,
          year: student.year,
          jobs: student.jobs.filter(job => job.status === 'interview' || job.status === 'hired')
        };
      }).filter(student => student.jobs.length > 0);

      setNotify(filteredJobs);
    } catch (error) {
      console.log('Error while fetching updates notification: ', error);
    } finally {
      setLoading(false); // Turn off loading after fetching
    }
  };

  return (
    <>
      <div className="my-2 mx-2 w-full backdrop-blur-md bg-white/30 border border-white/20 rounded-lg py-2 px-3 shadow shadow-red-400">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold my-2">Notification</h3>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <i className="fa-solid fa-spinner fa-spin text-2xl" />
          </div>
        ) : (
          <div className="relative h-72 overflow-hidden">
            <div className="absolute bottom-0 w-full flex flex-col gap-2 h-full animate-scrollUp">
              {notify?.length > 0 ? (
                notify.map((student, studentIndex) => (
                  <Link
                    className='no-underline text-blue-500 hover:text-blue-700'
                    to={
                      currentUser?.role === 'tpo_admin' ? `/tpo/user/${student.id}`
                        : currentUser?.role === 'management_admin' && `/management/user/${student.id}`
                    }
                    target="_blank"
                  >
                    <div key={studentIndex} className="p-2 h-fit rounded bg-yellow-200 border-2 border-black transition-all duration-200 ease-in-out hover:bg-yellow-300">
                      <span className='text-2xl text-black'>
                        {student.studentName} from
                        <b>
                          {student.year === 1 && ' First Year '}
                          {student.year === 2 && ' Second Year '}
                          {student.year === 3 && ' Third Year '}
                          {student.year === 4 && ' Fourth Year '}
                        </b>
                        {student.department}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {student.jobs.map((job, jobIndex) => (
                          <Link
                            className='text-blue-500 no-underline hover:text-blue-700'
                            to={
                              currentUser?.role === 'tpo_admin' ? `/tpo/job/${job?.jobId}`
                                : currentUser?.role === 'management_admin' && `/management/job/${job?.jobId}`
                            }
                            target="_blank"
                          >
                            <div key={jobIndex} className="py-1 h-fit">
                              {job?.jobTitle} at {job?.companyName}
                              <span className='mx-2 text-gray-500 hover:text-gray-600'>
                                Status: {job?.status.charAt(0).toUpperCase() + job?.status.slice(1)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div>No notices found!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NotificationBox;

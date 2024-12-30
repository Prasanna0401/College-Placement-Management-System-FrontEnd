import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Placeholder from 'react-bootstrap/Placeholder';
import { useLocation, useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ModalBox from './Modal';
import Toast from './Toast';
import TablePlaceholder from './TablePlaceholder';
import { BASE_URL } from '../config/config';

function AllJobPost() {
  document.title = 'CPMS | Job Listings';
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const [currentUser, setCurrentUser] = useState(null);  // Set to null initially

  // Toast and Modal states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [dataToParasModal, setDataToParasModal] = useState(null);
  const [modalBody, setModalBody] = useState({
    cmpName: '',
    jbTitle: ''
  });

  // Checking for authentication and fetching user details
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
        });
        fetchJobs();  // Fetch jobs only after the user info is loaded
      })
      .catch(err => {
        console.log("Error in fetching user details => ", err);
        setToastMessage(err.message || 'Error loading user data');
        setShowToast(true);
      });
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`);
      setJobs(response.data.data);
      fetchCompanies(response.data.data);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  };

  const fetchCompanies = async (jobs) => {
    const companyNames = {};
    for (const job of jobs) {
      if (job.company && !companyNames[job.company]) {
        try {
          const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${job.company}`);
          companyNames[job.company] = response.data.company.companyName;
        } catch (error) {
          console.log("Error fetching company name => ", error);
        }
      }
    }
    setCompanies(companyNames);
    setLoading(false);
  };

  const handleDeletePost = (jobId, cmpName, jbTitle) => {
    setDataToParasModal(jobId);
    setModalBody({
      cmpName: cmpName,
      jbTitle: jbTitle
    });
    setShowModal(true);
  };

  const confirmDelete = async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/tpo/delete-job`, { jobId });
      setShowModal(false);
      fetchJobs();
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error deleting job ", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDataToParasModal(null);
  };

  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      navigate('.', { replace: true, state: {} });
    }
    if (!jobs) setLoading(false);
  }, []);

  return (
    <>
      {/* Toast Component */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className=''>
        {
          loading || !currentUser ? (
            <TablePlaceholder />
          ) : (
            <div className="overflow-x-auto max-sm:text-sm max-sm:p-1">
              <div className="table-scrollbar">
                <Table striped bordered hover className='bg-white my-6 rounded-lg shadow w-full'>
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th><b>Company Name</b></th>
                      <th>Job Title</th>
                      <th>Annual CTC</th>
                      <th>Last date of Application</th>
                      <th>No. of Students Applied</th>
                      <th>Action</th>
                      {/* <th style={{ width: '5%' }}>Sr. No.</th>
                    <th style={{ width: '18%' }}><b>Company Name</b></th>
                    <th style={{ width: '18%' }}>Job Title</th>
                    <th style={{ width: '10%' }}>Annual CTC</th>
                    <th style={{ width: '15%' }}>Last date of Application</th>
                    <th style={{ width: '15%' }}>No. of Students Applied</th>
                    <th style={{ width: '15%' }}>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {jobs?.length > 0 ? (
                      jobs?.map((job, index) => {
                        const isMatched = job?.applicants?.find(student => student.studentId == currentUser.id);
                        return (
                          <tr
                            key={job?._id}
                            className={`${isMatched ? 'table-success' : ''}`}
                          >
                            <td>{index + 1}</td>
                            <td>
                              <b>
                                {companies[job?.company] || <Placeholder as="p" animation="glow">
                                  <Placeholder xs={12} />
                                </Placeholder>}
                              </b>
                            </td>
                            <td>{job?.jobTitle}</td>
                            <td>{job?.salary}</td>
                            <td>{new Date(job?.applicationDeadline).toLocaleDateString('en-In')}</td>
                            <td>{job?.applicants?.length}</td>
                            <td>
                              <div className="flex justify-around items-center">
                                <div className="px-0.5">
                                  {/* View Post */}
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={<Tooltip>View Post</Tooltip>}
                                  >
                                    <i
                                      className="fa-solid fa-circle-info text-2xl max-sm:text-lg cursor-pointer transition-colors duration-200 ease-in-out hover:text-blue-500"
                                      onClick={() => {
                                        const rolePaths = {
                                          'tpo_admin': `../tpo/job/${job._id}`,
                                          'management_admin': `../management/job/${job._id}`,
                                          'superuser': `../admin/job/${job._id}`,
                                          'student': `../student/job/${job._id}`,
                                        };
                                        navigate(rolePaths[currentUser.role]);
                                      }}
                                    />
                                  </OverlayTrigger>
                                </div>
                                {
                                  currentUser.role !== 'student' && (
                                    <>
                                      {/* Edit Post */}
                                      <div className="px-0.5">
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 250, hide: 400 }}
                                          overlay={<Tooltip>Edit Post</Tooltip>}
                                        >
                                          <i
                                            className="fa-regular fa-pen-to-square text-2xl max-sm:text-lg cursor-pointer transition-colors duration-200 ease-in-out hover:text-green-500 hover:fa-solid"
                                            onClick={() => {
                                              const rolePaths = {
                                                'tpo_admin': `../tpo/post-job/${job._id}`,
                                                'management_admin': `../management/post-job/${job._id}`,
                                                'superuser': `../admin/post-job/${job._id}`,
                                              };
                                              navigate(rolePaths[currentUser.role]);
                                            }}
                                          />
                                        </OverlayTrigger>
                                      </div>

                                      {/* Delete Post */}
                                      <div className="px-0.5">
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 250, hide: 400 }}
                                          overlay={<Tooltip>Delete Post</Tooltip>}
                                        >
                                          <i
                                            className="fa-regular fa-trash-can text-2xl max-sm:text-lg cursor-pointer transition-colors duration-200 ease-in-out hover:text-red-500 hover:fa-solid"
                                            onClick={() => handleDeletePost(job?._id, companies[job?.company], job?.jobTitle)}
                                          />
                                        </OverlayTrigger>
                                      </div>
                                    </>
                                  )
                                }
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No Job Posts Found!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>



          )
        }
      </div>

      {/* Modal Box for Confirm Delete */}
      <ModalBox
        show={showModal}
        modalHeader={`Confirm Delete ${modalBody?.cmpName}`}
        modalBody={<>
          Are you sure you want to delete this post of <b>{modalBody?.jbTitle}</b> from {modalBody?.cmpName}?
        </>}
        modalActions={<>
          <button className='btn btn-secondary' onClick={closeModal}>
            Cancel
          </button>
          <button className='btn btn-danger' onClick={() => confirmDelete(dataToParasModal)}>
            Delete
          </button>
        </>}
      />
    </>
  );
}

export default AllJobPost;

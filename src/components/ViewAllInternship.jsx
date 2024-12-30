import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Placeholder from 'react-bootstrap/Placeholder';
import { useLocation, useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ModalBox from './Modal';
import Toast from './Toast';
import { BASE_URL } from '../config/config';
import TablePlaceholder from './TablePlaceholder';

function AddInternship() {
  document.title = 'CPMS | My Internships';
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState({});
  const [dataToParasModal, setDataToParasModal] = useState('');

  // useState for load data
  const [currentUser, setCurrentUser] = useState({});

  // checking for authentication
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
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
        setToastMessage(err);
        setShowToast(true);
      });

    // calling function fetch jobs
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      if (!currentUser?.id) return;
      const response = await axios.get(`${BASE_URL}/student/internship?studentId=${currentUser?.id}`);
      setInternships(response.data.internships);
      // console.log(response.data);
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  useEffect(() => {
    fetchInternships();
  }, [currentUser?.id]);

  const handleDeleteInternship = (internshipId, cmpName) => {
    setDataToParasModal(internshipId);
    setModalBody({
      cmpName: cmpName,
    });
    setShowModal(true);
  }

  const confirmDelete = async (internshipId) => {
    try {
      const response = await axios.post(`${BASE_URL}/student/delete-internship`, { internshipId, studentId: currentUser.id });

      setShowModal(false);
      fetchInternships();
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      // setLoading(false);
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error deleting job ", error);
    }
  }


  const renderTooltipEditInternship = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit Internship Detail
    </Tooltip>
  );

  const renderTooltipDeleteInternship = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete Internship
    </Tooltip>
  );

  const closeModal = () => setShowModal(false);


  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      // Clear the state after the toast is shown
      navigate('.', { replace: true, state: {} });
    }
  }, []);


  return (
    <>
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
            loading ? (
              // fake table loading animation 
              <TablePlaceholder />
            ) : (
              <Table striped bordered hover className='bg-white my-6 rounded-lg shadow w-full text-base max-lg:text-sm max-md:my-3'>
                <thead>
                  <tr>
                    <th style={{ width: '6%' }}>Sr. No.</th>
                    <th style={{ width: '16%' }}><b>Company Name</b></th>
                    <th style={{ width: '13%' }}>Company Website</th>
                    <th style={{ width: '14%' }}>Internship Start Date</th>
                    <th style={{ width: '14%' }}>Internship End Date</th>
                    <th style={{ width: '13%' }}>Internship Duration</th>
                    <th style={{ width: '11%' }}>Monthly Stipend</th>
                    <th style={{ width: '13%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {internships?.length > 0 ? (
                    internships?.map((internship, index) => (
                      <tr key={internship?._id}>
                        <td>{index + 1}</td>
                        <td>
                          <b>
                            {internship?.companyName || '-'}
                          </b>
                        </td>
                        <td>
                          {
                            internship?.companyWebsite ? (
                              <a href={internship?.companyWebsite} target='_blanck' className='no-underline text-blue-500 hover:text-blue-700'>
                                {internship?.companyWebsite}
                              </a>
                            ) : '-'
                          }
                        </td>
                        <td>
                          {new Date(internship?.startDate).toLocaleDateString('en-IN') || '-'}
                        </td>
                        <td>
                          {new Date(internship?.endDate).toLocaleDateString('en-IN') || '-'}
                        </td>
                        <td>
                          {internship?.internshipDuration ? internship?.internshipDuration + " days" : '-'}
                        </td>
                        <td>
                          {internship?.monthlyStipend ? "Rs. " + internship?.monthlyStipend : '-'}
                        </td>
                        <td>
                          {/* for hover label effect  */}
                          <div className="flex justify-around items-center max-lg:flex-col max-lg:gap-1">
                            <div className="px-0.5">
                              {/* edit internship  */}
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltipEditInternship}
                              >
                                <i
                                  className="fa-regular fa-pen-to-square text-2xl cursor-pointer transition-colors duration-200 ease-in-out hover:text-blue-500"
                                  onClick={() => navigate(`../student/add-internship/${internship._id}`)}
                                  onMouseEnter={(e) => {
                                    e.target.classList.add('fa-solid');
                                    e.target.classList.remove('fa-regular');
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.classList.add('fa-regular');
                                    e.target.classList.remove('fa-solid');
                                  }}
                                />
                              </OverlayTrigger>
                            </div>
                            <div className="px-0.5">
                              {/* delete internship  */}
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltipDeleteInternship}
                              >
                                <i
                                  className="fa-regular fa-trash-can text-2xl cursor-pointer transition-colors duration-200 ease-in-out hover:text-red-500"
                                  onClick={() => handleDeleteInternship(internship?._id, internship?.companyName)}
                                  onMouseEnter={(e) => {
                                    e.target.classList.add('fa-solid');
                                    e.target.classList.remove('fa-regular');
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.classList.add('fa-regular');
                                    e.target.classList.remove('fa-solid');
                                  }}
                                />
                              </OverlayTrigger>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">Internship Not Added Yet!</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )
          }
        </div >


        {/* ModalBox Component for Delete Confirmation */}
        <ModalBox
          show={showModal}
          close={closeModal}
          header={"Confirmation"}
          body={`Do you want to delete internship of ${modalBody.cmpName}?`}
          btn={"Delete"}
          confirmAction={() => confirmDelete(dataToParasModal)}
        />
      </>
    </>
  )
}

export default AddInternship

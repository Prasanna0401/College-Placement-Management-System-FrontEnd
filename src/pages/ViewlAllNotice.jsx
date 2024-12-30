import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';
import TablePlaceholder from '../components/TablePlaceholder';
import Toast from '../components/Toast';
import ModalBox from '../components/Modal';
import { BASE_URL } from '../config/config';


function ViewlAllNotice() {
  document.title = 'CPMS | Notices';
  const [loading, setLoading] = useState(true);
  const [noticesData, setNoticesData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [modalToPass, setModalToPass] = useState('');

  const closeModal = () => setShowModal(false);

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete Notice
    </Tooltip>
  );

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
    if (currentUser?.role) {
      fetchNotices();
    }
  }, [currentUser?.role]);

  const handleDelete = async (noticeId) => {
    setModalToPass(noticeId);
    setShowModal(true);
  };

  const confirmDelete = async (noticeId) => {
    try {
      const response = await axios.post(`${BASE_URL}/management/delete-notice?noticeId=${noticeId}`);
      if (response?.data?.msg) {
        fetchNotices();
        setToastMessage(response.data.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log('Error while deleting notice => ', error);
    }
    setShowModal(false);
  };

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/management/get-all-notices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (currentUser?.role === 'tpo_admin') {
        const filteredNotices = response?.data?.filter(notice => (
          notice.sender_role === 'tpo_admin' || notice.receiver_role === 'tpo_admin'
        ));
        setNoticesData(filteredNotices);
      } else if (currentUser?.role === 'student') {
        const filteredNotices = response?.data?.filter(notice => notice.receiver_role === 'student');
        setNoticesData(filteredNotices);
      } else {
        setNoticesData(response.data);
      }
    } catch (error) {
      console.log('Error while fetching notices => ', error);
    } finally {
      setLoading(false);
    }
  };


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

      {
        loading ? (
          <TablePlaceholder />
        ) : (
          <>
            <div className=''>
              <Table striped bordered hover className='bg-white my-6 rounded-lg shadow w-full text-base max-sm:text-sm'>
                <thead>
                  <tr>
                    <th style={{ width: '2%' }}>#</th>
                    <th style={{ width: '20%' }}>Title</th>
                    {
                      currentUser?.role !== 'student' && (
                        <>
                          <th style={{ width: '10%' }}>Sender Role</th>
                          <th style={{ width: '10%' }}>Receiver Role</th>
                        </>
                      )
                    }
                    <th style={{ width: '40%' }}>Message</th>
                    <th style={{ width: '18%' }}>Time Posted</th>
                    {
                      currentUser?.role !== 'student' && (
                        <th style={{ width: '5%' }}>Action</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {noticesData?.length > 0 ? (
                    noticesData?.map((notice, index) => (
                      <tr key={notice?._id}>
                        <td>
                          {index + 1}
                        </td>
                        <td>
                          <Link
                            to={
                              currentUser?.role === 'student'
                                ? `/student/notice/${notice?._id}`
                                : currentUser?.role === 'tpo_admin'
                                  ? `/tpo/notice/${notice?._id}`
                                  : currentUser.role === 'management_admin'
                                    ? `/management/notice/${notice?._id}`
                                    : ''
                            }
                            className='no-underline text-blue-500 hover:text-blue-700'
                          >
                            {notice?.title}
                            {(new Date() - new Date(notice?.createdAt)) / (1000 * 60 * 60 * 24) <= 2 && (
                              <Badge className="mx-2" bg="primary">New</Badge>
                            )}
                          </Link>
                        </td>
                        {
                          currentUser?.role !== 'student' && (
                            <>
                              <td>
                                {notice?.sender_role === 'management_admin' && 'Management'}
                                {notice?.sender_role === 'tpo_admin' && 'TPO'}
                              </td>
                              <td>
                                {notice?.receiver_role === 'tpo_admin' && 'TPO'}
                                {notice?.receiver_role === 'student' && 'Student'}
                              </td>
                            </>
                          )
                        }
                        <td>
                          {notice?.message}
                        </td>
                        <td>
                          {new Date(notice.createdAt).toLocaleDateString('en-IN') + " "}
                          <span className='text-gray-500'>
                            {new Date(notice.createdAt).toLocaleTimeString('en-IN')}
                          </span>
                        </td>
                        {
                          currentUser?.role !== 'student' && (
                            ((currentUser?.role === 'tpo_admin' && notice?.sender_role !== 'management_admin') || currentUser?.role === 'management_admin') ? (
                              <>
                                <td>
                                  {/* for hover label effect  */}
                                  <div className="flex justify-around items-center">
                                    <OverlayTrigger
                                      placement="top"
                                      delay={{ show: 250, hide: 400 }}
                                      overlay={renderTooltipDelete}
                                    >
                                      <i
                                        className="fa-regular fa-trash-can text-2xl cursor-pointer hover:text-red-500"
                                        onClick={() => handleDelete(notice._id)}
                                        onMouseEnter={(e) => {
                                          e.target.classList.remove('fa-regular');
                                          e.target.classList.add('fa-solid');
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.classList.remove('fa-solid');
                                          e.target.classList.add('fa-regular');
                                        }}
                                      />
                                    </OverlayTrigger>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <td className='text-center'>
                                -
                              </td>
                            )
                          )
                        }
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No notices found!</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div >
          </>
        )
      }


      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Want to delete notice?`}
        btn={"Delete"}
        confirmAction={() => confirmDelete(modalToPass)}
      />
    </>
  )
}

export default ViewlAllNotice

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from './Toast';
import ModalBox from './Modal';
import { BASE_URL } from '../config/config';
import { useNavigate } from 'react-router-dom';

function SendNotice() {
  document.title = 'CPMS | Send Notice';

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // Loading state for initial fetch

  const [data, setData] = useState({});          // Form data state
  const [error, setError] = useState('');        // Error message state

  const [currentUser, setCurrentUser] = useState({ role: '', id: '' });  // Current user state
  const [showToast, setShowToast] = useState(false);                     // Toast visibility
  const [toastMessage, setToastMessage] = useState('');                  // Toast message content
  const [showModal, setShowModal] = useState(false);                     // Modal visibility

  const closeModal = () => setShowModal(false);  // Function to close the modal

  // Fetch current user data and handle authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  // Redirect to login if no token
      return;
    }

    axios.get(`${BASE_URL}/user/detail`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          role: res.data.role,
        });
        setLoading(false);  // End loading once data is fetched
      })
      .catch(err => {
        console.log("SendNotice.jsx => ", err);
        navigate('/login');  // Redirect to login on error
      });
  }, [navigate]);

  // Handle form input changes
  const handleDataChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  // Submit form
  const handleSubmit = () => {
    if (!data?.receiver_role && !data?.title && !data?.message) {
      setError('All Fields Required!');
      return;
    }
    setShowModal(true);  // Show confirmation modal
  }

  // Confirm the submission
  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/send-notice`, data, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      navigate(currentUser?.role === 'management_admin' ? '/management/all-notice' : '/tpo/all-notice');
    } catch (error) {
      console.log('Error while sending notice: ', error);
    }
    setShowModal(false);
  }

  // Update data with current user info after user data is loaded
  useEffect(() => {
    if (currentUser?.role && currentUser?.id) {
      setData(prevData => ({
        ...prevData,
        sender: currentUser?.id,
        sender_role: currentUser?.role,
      }));
    }
  }, [currentUser]);

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

      {loading ? (
        <div className="flex justify-center h-72 items-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl" />
        </div>
      ) : (
        <>
          <div className="">
            <div className="my-8 backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 max-sm:text-sm max-sm:p-3">
              <div className="grid grid-cols-2 gap-2">

                {/* Receiver Role (Only for Management Admin) */}
                {currentUser?.role === 'management_admin' && (
                  <FloatingLabel
                    controlId="floatingSendTo"
                    label={<span>Receiver Role <span style={{ color: 'red' }}>*</span></span>}
                  >
                    <Form.Select
                      aria-label="Floating label select send to"
                      className="cursor-pointer"
                      name="receiver_role"
                      value={data?.receiver_role || ""}
                      onChange={handleDataChange}
                    >
                      <option disabled value="" className="text-gray-400">
                        Select Receiver Role...
                      </option>
                      <option value="student">Student</option>
                      <option value="tpo_admin">TPO</option>
                    </Form.Select>
                  </FloatingLabel>
                )}

                {/* Title Input */}
                <FloatingLabel
                  controlId="floatingTitle"
                  label={<span>Title <span style={{ color: 'red' }}>*</span></span>}
                  className={currentUser?.role === 'tpo_admin' ? 'col-span-2' : ''}
                >
                  <Form.Control
                    type="text"
                    placeholder="Title"
                    name='title'
                    value={data?.title || ""}
                    onChange={handleDataChange}
                  />
                </FloatingLabel>

                {/* Message Input */}
                <div className="col-span-2">
                  <FloatingLabel
                    controlId="floatingMessage"
                    label={<span>Message <span style={{ color: 'red' }}>*</span></span>}
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Message"
                      name='message'
                      style={{ maxHeight: "250px", height: "200px" }}
                      value={data?.message || ""}
                      onChange={handleDataChange}
                    />
                  </FloatingLabel>
                </div>
              </div>

              {/* Error Display */}
              <div className="mt-2">
                <span className='text-center text-red-500'>
                  {error && error}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col justify-center items-center gap-2">
              <Button
                variant="primary"
                size='lg'
                onClick={handleSubmit}
                onMouseEnter={(e) => {
                  e.target.querySelector('i').classList.add('fa-solid', 'fa-bounce');
                }}
                onMouseLeave={(e) => {
                  e.target.querySelector('i').classList.remove('fa-solid', 'fa-bounce');
                }}
              >
                <i className="fa-regular fa-paper-plane mr-2" />
                Send
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ModalBox Component */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Sending Notice ${data?.message ? `"${data?.message}"` : ""} to ${data?.receiver_role || "student"}?`}
        btn={"Send"}
        confirmAction={confirmSubmit}
      />
    </>
  )
}

export default SendNotice;

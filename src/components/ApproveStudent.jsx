import React, { useEffect, useState } from 'react';
import AddUserTable from './AddUserTable';
import Toast from './Toast';
import ModalBox from './Modal';
import axios from 'axios';
import { BASE_URL } from '../config/config';

function ApproveStudent() {
  document.title = 'CPMS | Approve Students';

  // student users store here
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [userEmailToProcess, setUserEmailToProcess] = useState(null);
  const [modalBody, setModalBody] = useState('');
  const [modalBtn, setModalBtn] = useState('');

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/student-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (response.data) {
        // checking isApprove is false
        const filteredUsers = response.data.studentUsers.filter(element => !element.studentProfile.isApproved);
        setUsers(filteredUsers);
      } else {
        console.warn('Response does not contain studentUsers:', response.data);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleDeleteUser = (email) => {
    setUserEmailToProcess(email);
    setModalBody(`Do you want to delete ${email}?`);
    setModalBtn("Delete");
    // setModalAction(confirmDelete);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/student-delete-user`,
        { email: userEmailToProcess },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      setShowModal(false);
      if (response.data) {
        setToastMessage(response.data.msg);
        setShowToast(true);
        fetchUserDetails();
      }
    } catch (error) {
      console.log("student => confirmDelete ==> ", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setUserEmailToProcess(null);
  };

  // approve student user method
  const handleApproveStudent = (email) => {
    setUserEmailToProcess(email);
    setModalBody(`Do you want to approve ${email}?`);
    setModalBtn("Approve");
    // setModalAction(confirmApproveStudent);
    setShowModal(true);
  };

  const confirmApproveStudent = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/student-approve`,
        { email: userEmailToProcess }, // Use the state `userEmailToProcess` instead of `email`
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.data) {
        setToastMessage(response.data.msg || "User approved successfully");
        setShowToast(true);
        fetchUserDetails(); // Refresh the user list after approval
      }
      setShowModal(false);
    } catch (error) {
      setToastMessage("Error approving user");
      setShowToast(true);
      console.log("handleApproveStudent => AddUersTable.jsx ==> ", error);
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

      {/* AddUserTable Component */}
      <AddUserTable
        users={users}
        loading={loading}
        handleDeleteUser={handleDeleteUser}
        showModal={showModal}
        closeModal={closeModal}
        confirmDelete={confirmDelete}
        userToDelete={userEmailToProcess}
        userToAdd={"approve-student"}
        handleApproveStudent={handleApproveStudent}
      />

      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={modalBody}
        btn={modalBtn}
        confirmAction={modalBtn === "Delete" ? confirmDelete : confirmApproveStudent}
      />
    </>
  );
}

export default ApproveStudent;

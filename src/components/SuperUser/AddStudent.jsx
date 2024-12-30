import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from '../Toast';
import ModalBox from '../Modal';
import AddUserTable from '../AddUserTable';
import { BASE_URL } from '../../config/config';

function AddStudent() {

  // student users store here
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/student-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (response.data) {
        setUsers(response.data.studentUsers);
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

  const [formOpen, setFormOpen] = useState(false);
  const [data, setData] = useState({
    first_name: "",
    email: "",
    number: "",
    password: ""
  });

  const handleDataChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleDeleteUser = (email) => {
    setUserToDelete(email);
    setShowModal(true);
  }

  const confirmDelete = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/student-delete-user`,
        { email: userToDelete },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      
      if (response.data) {
        setToastMessage(response.data.msg);
        setShowToast(true);
        fetchUserDetails();
      }
    } catch (error) {
      console.log("student => confirmDelete ==> ", error);
      setToastMessage(error?.response?.data?.msg);
      setShowToast(true);
    }
    setShowModal(false);
  }

  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/admin/student-add-user`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      if (response.data) {
        setToastMessage(response.data.msg);
        setShowToast(true);
        fetchUserDetails();
      }
    } catch (error) {
      console.log("handleSubmit => Mangement.jsx ==> ", error);
    }
  }


  return (
    <>
      {/*  any message here  */}
      < Toast
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
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        data={data}
        handleDataChange={handleDataChange}
        handleSubmit={handleSubmit}
        showModal={showModal}
        closeModal={closeModal}
        confirmDelete={confirmDelete}
        userToDelete={userToDelete}
        userToAdd="Student"
        handleApproveStudent={null}
      />

      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to delete ${userToDelete}?`}
        btn={"Delete"}
        confirmAction={confirmDelete}
      />
    </>
  )
}

export default AddStudent

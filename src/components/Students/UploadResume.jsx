import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { BASE_URL } from '../../config/config';

const UploadResume = ({ fetchCurrentUserData }) => {
  const [uploadStatus, setUploadStatus] = useState('');

  // useState for load data
  const [currentUser, setCurrentUser] = useState({
    id: '',
    role: '',
  });

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
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("UploadResume.jsx => ", err);
      });
  }, []);


  // Handle resume upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.files[0]) {
      setUploadStatus('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', e.target.files[0]);
    formData.append('userId', currentUser.id);

    try {
      const response = await axios.post(`${BASE_URL}/student/upload-resume`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      // console.log(response.data)
      // update userData in UpdatePlacementProfile
      if (fetchCurrentUserData) fetchCurrentUserData();
      setUploadStatus('Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading the resume', error);
      setUploadStatus('Error uploading the resume');
    }
  };

  return (
    <>
      {/* <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} /> */}
      <FloatingLabel controlId="floatingResume" label="Update Resume">
        <Form.Control
          type="file"
          accept='.pdf, .doc, .docx'
          placeholder="Upload Resume"
          name='resume'
          onChange={handleSubmit}
        />
        {uploadStatus && <p className='text-sm text-gray-300 mt-1'>{uploadStatus}</p>}
      </FloatingLabel>
    </>
  );
};

export default UploadResume;

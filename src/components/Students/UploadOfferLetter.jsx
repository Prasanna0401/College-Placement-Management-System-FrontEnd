import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { BASE_URL } from '../../config/config';

const UploadResume = ({ jobId, fetchJobDetailsOfApplicant }) => {
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
    formData.append('offerLetter', e.target.files[0]);
    formData.append('studentId', currentUser.id);
    formData.append('jobId', jobId);

    try {
      const response = await axios.post(`${BASE_URL}/student/upload-offer-letter`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      // console.log(response.data)
      setUploadStatus('Offer letter uploaded successfully');
      if (fetchJobDetailsOfApplicant) fetchJobDetailsOfApplicant();
    } catch (error) {
      console.error('Error uploading the offer letter', error);
      setUploadStatus('Error uploading the offer letter');
    }
  };

  return (
    <>
      {/* <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} /> */}
      <FloatingLabel controlId="floatingOfferLetter" label="Upload Offer Letter">
        <Form.Control
          type="file"
          accept='.pdf, .doc, .docx'
          placeholder="Upload Offer Letter"
          name='offerLetter'
          onChange={handleSubmit}
        />
        {uploadStatus && <p className='text-sm text-gray-300 mt-1'>{uploadStatus}</p>}
      </FloatingLabel>
    </>
  );
};

export default UploadResume;

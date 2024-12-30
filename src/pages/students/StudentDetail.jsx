import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/config';

function StudentDetail() {
  const { studentId } = useParams(); 
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/student/${studentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!studentData) {
    return <div>No student data found.</div>;
  }

  return (
    <div>
      <h1>{studentData.name}</h1>
      <p>Email: {studentData.email}</p>
      <p>Phone: {studentData.phone}</p>
      {/* Render more student data as needed */}
    </div>
  );
}

export default StudentDetail;

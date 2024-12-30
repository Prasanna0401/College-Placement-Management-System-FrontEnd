import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Toast from './Toast';
import { BASE_URL } from '../config/config';

function UserDetails() {
  document.title = 'CPMS | Complete Profile';
  const navigate = useNavigate();
  const location = useLocation();


  // userId but its userId
  const { userId } = useParams();

  // userData to store user data get from userId
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [currentUserData, setCurrentUserData] = useState('');

  // checking request is of complete-profile 
  const completeProfileReq = location.pathname.split('/').includes("complete-profile");


  const fetchCurrentUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCurrentUserData(response.data);
      // console.log(currentUserData);
      // console.log("resss", response.data);

      // check authenticate user is requesting or not
      if (completeProfileReq) {
        if (!(userId === response.data.id)) navigate('../404')

        // checking if user completed profile then redirect to dashboard
        if (response.data.isProfileCompleted === "true") {
          if (response.data.role === "student") navigate('../student/dashboard')
          if (response.data.role === "tpo_admin") navigate('../tpo/dashboard')
          if (response.data.role === "management_admin") navigate('../management/dashboard')
        }
      }

      setLoading(false);
    } catch (error) {
      console.log("Account.jsx => ", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUserData();

  }, [loading]);


  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setUserData(response.data);
        // console.log(response.data)
      } catch (error) {
        if (error.response.data) {
          setToastMessage(error.response.data.msg);
          setShowToast(true);
          if (error.response.data.msg === "Student not found" || "user not found")
            navigate("../404")
        }
        console.error("Error fetching student data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [userId]);

  const handleDataChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value })

  // console.log(userData)

  const handleDataChangeForSGPA = (e) => {
    setUserData({
      ...userData,
      studentProfile: {
        ...userData?.studentProfile,
        SGPA: {
          ...userData?.studentProfile?.SGPA,
          [e.target.name]: e.target.value
        }
      }
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/user/update-profile`,
        // for sending to backend is user is completing profile
        userData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      // console.log(response.data);
      // console.log(response.data.msg)
      if (response.data) {
        if (response.data.msg) {
          setToastMessage(response.data.msg);
          setShowToast(true);
          if (completeProfileReq) {
            if (response.data.msg === "Data Updated Successfully!")
              navigate('../management/dashboard');
          }
        }
        //   navigate("../student/dashboard");
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      //   navigate("../student/dashboard");
      console.log("UserDetails => ", error);
    }
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImgs', file);
      formData.append('userId', userData._id);

      try {
        const response = await axios.post(`${BASE_URL}/user/upload-photo`, formData);
        setUserData({ ...userData, profile: response.data.file });
        if (response.data) {
          if (response.data.msg) {
            setToastMessage(response.data.msg);
            setShowToast(true);
          }
        }
      } catch (error) {
        setToastMessage(error.msg);
        setShowToast(true);
        console.error('Error uploading photo:', error);
      }
    }
  }

  // for formating date of birth
  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  // console.log(userData)

  return (
    <>
      {
        loading ? (
          <div className="flex justify-center h-72 items-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl" />
          </div>
        ) : (
          <>
            {/*  any message here  */}
            < Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              message={toastMessage}
              delay={3000}
              position="bottom-end"
            />


            <div className='px-4 py-10'>
              <h1 className='text-2xl md:text-4xl'>
                {userData?.first_name + " "}
                {userData?.middle_name === undefined ? "" : userData?.middle_name + " "}
                {userData?.last_name === undefined ? "" : userData?.last_name}
              </h1>
              <form onSubmit={handleSubmit}>
                {/* personal info  */}
                <div className="my-8 backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6">
                  <span className="text-xl md:text-2xl">Personal Details</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {/* First Column */}
                    <div className="px-2 py-3 flex flex-col gap-3">
                      <FloatingLabel controlId="floatingFirstName" label="First Name">
                        <Form.Control
                          type="text"
                          placeholder="First Name"
                          name='first_name'
                          value={userData?.first_name}
                          onChange={handleDataChange}
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingMiddleName" label="Middle Name">
                        <Form.Control
                          type="text"
                          placeholder="Middle Name"
                          name='middle_name'
                          value={userData?.middle_name}
                          onChange={handleDataChange}
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingLastName" label="Last Name">
                        <Form.Control
                          type="text"
                          placeholder="Last Name"
                          name='last_name'
                          value={userData?.last_name}
                          onChange={handleDataChange}
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingEmail" label="Email address">
                        <Form.Control
                          type="email"
                          placeholder="Email address"
                          name='email'
                          value={userData?.email}
                          onChange={handleDataChange}
                          required={completeProfileReq}
                          disabled
                        />
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingNumber" label="Mobile Number" name='number'>
                        <Form.Control
                          type="number"
                          placeholder="Mobile Number"
                          name='number'
                          value={userData?.number}
                          onChange={handleDataChange}
                          onInput={(e) => {
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          }}
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </FloatingLabel>
                    </div>

                    {/* Second Column */}
                    <div className="px-2 py-3 flex flex-col gap-3">
                      <FloatingLabel controlId="floatingSelectGender" label="Gender">
                        <Form.Select
                          aria-label="Floating label select gender"
                          className="cursor-pointer"
                          name="gender"
                          value={userData?.gender === undefined ? "undefined" : userData?.gender}
                          onChange={handleDataChange}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        >
                          <option disabled value="undefined" className="text-gray-400">Enter Your Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingBirthDate" label="Date of Birth">
                        <Form.Control
                          type="date"
                          placeholder="Date of Birth"
                          name="dateOfBirth"
                          value={formatDate(userData?.dateOfBirth)}
                          onChange={handleDataChange}
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingTextareaAddress" label="Address" className="w-full">
                        <Form.Control
                          as="textarea"
                          placeholder="Enter Full Address here..."
                          style={{ height: '150px', resize: "none" }}
                          name="address"
                          value={userData?.fullAddress?.address}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              fullAddress: {
                                ...userData?.fullAddress,
                                address: e.target.value
                              }
                            });
                          }}
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingPincode" label="Pincode">
                        <Form.Control
                          type="number"
                          placeholder="Pincode"
                          maxLength={6}
                          name="pincode"
                          value={userData?.fullAddress?.pincode}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              fullAddress: {
                                ...userData?.fullAddress,
                                pincode: e.target.value
                              }
                            });
                          }}
                          pattern="\d{6}"
                          onInput={(e) => {
                            if (e.target.value.length > 6) {
                              e.target.value = e.target.value.slice(0, 6);
                            }
                          }}
                          required={completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </FloatingLabel>
                    </div>

                    {/* Third Column */}
                    <div className="px-2 py-3 flex flex-col items-center gap-4 my-1">
                      <Col className="w-32 md:w-44 lg:w-52">
                        <Image src={BASE_URL + userData?.profile} roundedCircle />
                      </Col>
                      <span className="text-xl">
                        {userData?.first_name + " "}
                        {userData?.middle_name ? userData?.middle_name + " " : ""}
                        {userData?.last_name || ""}
                      </span>
                      <FloatingLabel controlId="floatingFirstName" label="Change Profile Image">
                        <Form.Control
                          type="file"
                          accept=".jpg, .png, .jpeg"
                          placeholder="Change Profile Image"
                          name="profile"
                          onChange={handlePhotoChange}
                          required={userData?.profile === '/profileImgs/default/defaultProfileImg.jpg' && completeProfileReq}
                          disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                        />
                      </FloatingLabel>
                    </div>
                  </div>
                </div>


                {
                  userData?.role === "student" &&
                  (
                    <>
                      {/* college info  */}
                      <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 my-8">
                        <span className='text-2xl md:text-4xl'>College Information</span>
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="px-2 py-3 flex flex-col gap-3">
                            <FloatingLabel controlId="floatingUIN" label="UIN" >
                              <Form.Control
                                type="text"
                                placeholder="UIN"
                                name='uin'
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      UIN: e.target.value
                                    }
                                  });
                                }}
                                value={userData?.studentProfile?.UIN}
                                required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingRollNumber" label="Roll Number" >
                              <Form.Control
                                type="number"
                                placeholder="Roll Number"
                                name='rollNumber'
                                value={userData?.studentProfile?.rollNumber}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      rollNumber: e.target.value
                                    }
                                  });
                                }}
                                required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              />
                            </FloatingLabel>
                          </div>

                          <div className="px-2 py-3 flex flex-col gap-3">
                            <FloatingLabel controlId="floatingSelectDepartment" label="Department">
                              <Form.Select
                                aria-label="Floating label select department"
                                className='cursor-pointer'
                                name='department'
                                value={userData?.studentProfile?.department || "undefined"}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      department: e.target.value
                                    }
                                  });
                                }}
                                required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              >
                                <option disabled value="undefined" className='text-gray-400'>Enter Your Department</option>
                                <option value="Computer">Computer</option>
                                <option value="Civil">Civil</option>
                                <option value="ECS">ECS</option>
                                <option value="AIDS">AIDS</option>
                                <option value="Mechanical">Mechanical</option>
                              </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingSelectYear" label="Year">
                              <Form.Select
                                aria-label="Floating label select year"
                                className='cursor-pointer'
                                name='year'
                                value={userData?.studentProfile?.year || "undefined"}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      year: e.target.value
                                    }
                                  });
                                }}
                                required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              >
                                <option disabled value="undefined" className='text-gray-400'>Enter Your Year</option>
                                <option value="1">1st</option>
                                <option value="2">2nd</option>
                                <option value="3">3rd</option>
                                <option value="4">4th</option>
                              </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingAdmissionYear" label="Admission Year">
                              <Form.Control
                                type="number"
                                placeholder="Addmission Year"
                                maxLength={4}
                                pattern="\d{4}"
                                name='addmissionYear'
                                value={userData?.studentProfile?.addmissionYear}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      addmissionYear: e.target.value
                                    }
                                  });
                                }}
                                onInput={(e) => {
                                  if (e.target.value.length > 4) {
                                    e.target.value = e.target.value.slice(0, 4);
                                  }
                                }}
                                required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              />
                            </FloatingLabel>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className=" py-3 flex flex-wrap gap-2">
                              <FloatingLabel controlId="floatingSem1" label="Sem 1">
                                <Form.Control
                                  type="number"
                                  placeholder="Sem 1"
                                  name='sem1'
                                  value={userData?.studentProfile?.SGPA?.sem1}
                                  onChange={handleDataChangeForSGPA}
                                  // required={completeProfileReq}
                                  disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                                />
                              </FloatingLabel>
                              <FloatingLabel controlId="floatingSem2" label="Sem 2">
                                <Form.Control
                                  type="number"
                                  placeholder="Sem 2"
                                  name='sem2'
                                  value={userData?.studentProfile?.SGPA?.sem2}
                                  onChange={handleDataChangeForSGPA}
                                  // required={completeProfileReq}
                                  disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                                />
                              </FloatingLabel>
                              <FloatingLabel controlId="floatingSem3" label="Sem 3">
                                <Form.Control
                                  type="number"
                                  placeholder="Sem 3"
                                  name='sem3'
                                  value={userData?.studentProfile?.SGPA?.sem3}
                                  onChange={handleDataChangeForSGPA}
                                  // required={completeProfileReq}
                                  disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                                />
                              </FloatingLabel>
                              <FloatingLabel controlId="floatingSem4" label="Sem 4">
                                <Form.Control
                                  type="number"
                                  placeholder="Sem 4"
                                  name='sem4'
                                  value={userData?.studentProfile?.SGPA?.sem4}
                                  onChange={handleDataChangeForSGPA}
                                  // required={completeProfileReq}
                                  disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                                />
                              </FloatingLabel>
                            </div>
                            <div className=" py-3 flex flex-wrap gap-2">
                              <FloatingLabel controlId="floatingSem5" label="Sem 5">
                                <Form.Control
                                  type="number"
                                  placeholder="Sem 5"
                                  name='sem5'
                                  value={userData?.studentProfile?.SGPA?.sem5}
                                  onChange={handleDataChangeForSGPA}
                                  // required={completeProfileReq}
                                  disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                                />
                              </FloatingLabel>
                              <FloatingLabel controlId="floatingSem6" label="Sem 6">
                                <Form.Control
                                  type="number"
                                  placeholder="Sem 6"
                                  name='sem6'
                                  value={userData?.studentProfile?.SGPA?.sem6}
                                  onChange={handleDataChangeForSGPA}
                                  // required={completeProfileReq}
                                  disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                                />
                              </FloatingLabel>
                              <FloatingLabel controlId="floatingSem7" label="Sem 7">
                                <Form.Control
                                  type="number"
                                  placeholder="Sem 7"
                                  name='sem7'
                                  value={userData?.studentProfile?.SGPA?.sem7}
                                  onChange={handleDataChangeForSGPA}
                                  // required={completeProfileReq}
                                  disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                                />
                              </FloatingLabel>
                              <FloatingLabel controlId="floatingSem8" label="Sem 8">
                                <Form.Control
                                  type="number"
                                  placeholder="Sem 8"
                                  name='sem8'
                                  value={userData?.studentProfile?.SGPA?.sem8}
                                  onChange={handleDataChangeForSGPA}
                                  // required={completeProfileReq}
                                  disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                                />
                              </FloatingLabel>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* past qualification  */}
                      <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 my-8">
                        <span className='text-2xl md:text-4xl'>Past Qualification</span>
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="px-2 py-3 flex flex-col gap-2">
                            <FloatingLabel controlId="floatingSelectSSC" label="SSC Board Name">
                              <Form.Select
                                aria-label="Floating label select SSCBoard"
                                className='cursor-pointer'
                                name='sscBoard'
                                value={userData?.studentProfile?.pastQualification?.ssc?.board || "undefined"}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      pastQualification: {
                                        ...userData?.studentProfile?.pastQualification,
                                        ssc: {
                                          ...userData?.studentProfile?.pastQualification?.ssc,
                                          board: e.target.value
                                        }
                                      }
                                    }
                                  });
                                }}
                                required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              >
                                <option disabled value="undefined" className='text-gray-400'>Enter Your SSC Board Name</option>
                                <option value="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)">Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)</option>
                                <option value="Central Board of Secondary Education (CBSE)">Central Board of Secondary Education (CBSE)</option>
                                <option value="Council for the Indian School Certificate Examinations (CISCE)">Council for the Indian School Certificate Examinations (CISCE)</option>
                                <option value="Other">Other</option>
                              </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingSSCMarks" label="SSC Percentage">
                              <Form.Control
                                type="number"
                                placeholder="SSC Percentage"
                                name='sscPercentage'
                                value={userData?.studentProfile?.pastQualification?.ssc?.percentage}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      pastQualification: {
                                        ...userData?.studentProfile?.pastQualification,
                                        ssc: {
                                          ...userData?.studentProfile?.pastQualification?.ssc,
                                          percentage: e.target.value
                                        }
                                      }
                                    }
                                  });
                                }}
                                required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingSelectSSCPassingYear" label="SSC Passing Year">
                              <Form.Control
                                type="number"
                                placeholder="SSC Passing Year"
                                name='sscPassingYear'
                                value={userData?.studentProfile?.pastQualification?.ssc?.year}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      pastQualification: {
                                        ...userData?.studentProfile?.pastQualification,
                                        ssc: {
                                          ...userData?.studentProfile?.pastQualification?.ssc,
                                          year: e.target.value
                                        }
                                      }
                                    }
                                  });
                                }}
                                required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              />
                            </FloatingLabel>
                          </div>

                          <div className="px-2 py-3 flex flex-col gap-2">
                            <FloatingLabel controlId="floatingSelectHSC" label="HSC Board Name">
                              <Form.Select
                                aria-label="Floating label select HSC Board"
                                className='cursor-pointer'
                                name='hscBoard'
                                value={userData?.studentProfile?.pastQualification?.hsc?.board || "undefined"}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      pastQualification: {
                                        ...userData?.studentProfile?.pastQualification,
                                        hsc: {
                                          ...userData?.studentProfile?.pastQualification?.hsc,
                                          board: e.target.value
                                        }
                                      }
                                    }
                                  });
                                }}
                                // required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              >
                                <option disabled value="undefined" className='text-gray-400'>Enter Your HSC Board Name</option>
                                <option value="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)">Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)</option>
                                <option value="Central Board of Secondary Education (CBSE)">Central Board of Secondary Education (CBSE)</option>
                                <option value="Council for the Indian School Certificate Examinations (CISCE)">Council for the Indian School Certificate Examinations (CISCE)</option>
                                <option value="Other">Other</option>
                              </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingHSCMarks" label="HSC Percentage">
                              <Form.Control
                                type="number"
                                placeholder="HSC Percentage"
                                name='hscPercentage'
                                value={userData?.studentProfile?.pastQualification?.hsc?.percentage}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      pastQualification: {
                                        ...userData?.studentProfile?.pastQualification,
                                        hsc: {
                                          ...userData?.studentProfile?.pastQualification?.hsc,
                                          percentage: e.target.value
                                        }
                                      }
                                    }
                                  });
                                }}
                                // required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingSelectHSCPassingYear" label="HSC Passing Year">
                              <Form.Control
                                type="number"
                                placeholder="HSC Passing Year"
                                name='hscPassingYear'
                                value={userData?.studentProfile?.pastQualification?.hsc?.year}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      pastQualification: {
                                        ...userData?.studentProfile?.pastQualification,
                                        hsc: {
                                          ...userData?.studentProfile?.pastQualification?.hsc,
                                          year: e.target.value
                                        }
                                      }
                                    }
                                  });
                                }}
                                // required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              />
                            </FloatingLabel>
                          </div>

                          <div className="px-2 py-3 flex flex-col gap-2">
                            <FloatingLabel controlId="floatingSelectDiploma" label="Diploma Board Name">
                              <Form.Select
                                aria-label="Floating label select Diploma Board"
                                className='cursor-pointer'
                                name='diplomaBoard'
                                value={userData?.studentProfile?.pastQualification?.diploma?.department || "undefined"}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      pastQualification: {
                                        ...userData?.studentProfile?.pastQualification,
                                        diploma: {
                                          ...userData?.studentProfile?.pastQualification?.diploma,
                                          department: e.target.value
                                        }
                                      }
                                    }
                                  });
                                }}
                                // required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              >
                                <option disabled value="undefined" className='text-gray-400'>Enter Your Diploma University Name</option>
                                <option value="Computer">Computer</option>
                                <option value="Civil">Civil</option>
                                <option value="Mechanical">Mechanical</option>
                                <option value="ECS">ECS</option>
                                <option value="AIDS">AIDS</option>
                                <option value="Other">Other</option>
                              </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingDiplomaMarks" label="Diploma Percentage or CGPA">
                              <Form.Control
                                type="number"
                                placeholder="Diploma Percentage"
                                name='diplomaPercentage'
                                value={userData?.studentProfile?.pastQualification?.diploma?.percentage}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      pastQualification: {
                                        ...userData?.studentProfile?.pastQualification,
                                        diploma: {
                                          ...userData?.studentProfile?.pastQualification?.diploma,
                                          percentage: e.target.value
                                        }
                                      }
                                    }
                                  });
                                }}
                                // required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingSelectDiplomaPassingYear" label="Diploma Passing Year">
                              <Form.Control
                                type="number"
                                placeholder="Diploma Passing Year"
                                name='diplomaPassingYear'
                                value={userData?.studentProfile?.pastQualification?.diploma?.year}
                                onChange={(e) => {
                                  setUserData({
                                    ...userData,
                                    studentProfile: {
                                      ...userData?.studentProfile,
                                      pastQualification: {
                                        ...userData?.studentProfile?.pastQualification,
                                        diploma: {
                                          ...userData?.studentProfile?.pastQualification?.diploma,
                                          year: e.target.value
                                        }
                                      }
                                    }
                                  });
                                }}
                                // required={completeProfileReq}
                                disabled={!completeProfileReq && currentUserData.role !== 'superuser'}
                              />
                            </FloatingLabel>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                }

                {
                  (completeProfileReq || currentUserData.role === 'superuser') && (
                    <div className="flex flex-col justify-center items-center gap-2">
                      <Button variant="primary" type='submit' size='lg'>Update</Button>
                    </div>
                  )
                }
              </form>
            </div>
          </>
        )
      }
    </>
  )
}

export default UserDetails

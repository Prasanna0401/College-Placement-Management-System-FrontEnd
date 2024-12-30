import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Toast from '../Toast';
import UploadResume from './UploadResume';
import { BASE_URL } from '../../config/config';


function UpdatePlacementProfile() {
  document.title = 'CPMS | Placement Profile';

  // userData to store user data get from userId
  const [userData, setUserData] = useState(null);


  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  const fetchCurrentUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setUserData(response.data);
      // console.log(userData);
      // console.log("resss", response.data);

      setLoading(false);
    } catch (error) {
      console.log("Account.jsx => ", error);
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchCurrentUserData();
    calcCGPA();
  }, [loading]);

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
    });
    calcCGPA();
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
      if (response.data) {
        if (response.data.msg) {
          setToastMessage(response.data.msg);
          setShowToast(true);
        }
        //   navigate("../student/dashboard");
      }
    } catch (error) {
      console.log("UserDetails => ", error);
    }
  }

  // console.log(userData);

  const [cgpa, setCgpa] = useState(0);

  const calcCGPA = () => {
    let sum = 0, sem = 0;
    if (userData?.studentProfile?.SGPA?.sem1 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem1);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem2 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem2);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem3 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem3);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem4 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem4);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem5 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem5);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem6 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem6);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem7 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem7);
      sem += 1;
    }
    if (userData?.studentProfile?.SGPA?.sem8 !== '0' || 0) {
      sum += Number(userData?.studentProfile?.SGPA?.sem8);
      sem += 1;
    }
    setCgpa((sum / sem).toFixed(2));
  }

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


            <div className=''>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 my-4 text-base max-sm:text-sm">
                  {/* basic info  */}
                  <div className="grid backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 max-md:col-span-2">
                    <span className='text-2xl max-sm:text-xl'>Basic Details</span>
                    <div className="flex flex-col justify-between py-2">
                      {/* Basic Info */}
                      <div className="flex justify-between">
                        <div className="space-y-4">
                          <div>
                            <span className="text-gray-700 font-bold">Full Name: </span>
                            <span className="text-gray-800">
                              {userData?.first_name + " "}
                              {userData?.middle_name && userData?.middle_name + " "}
                              {userData?.last_name}
                            </span>
                          </div>

                          <div>
                            <span className="text-gray-700 font-bold">Email: </span>
                            <span className="text-gray-800">
                              {userData?.email}
                            </span>
                          </div>

                          <div>
                            <span className="text-gray-700 font-bold">Number: </span>
                            <span className="text-gray-800">
                              {userData?.number}
                            </span>
                          </div>

                          {
                            userData?.studentProfile?.uin && (
                              <div>
                                <span className="text-gray-700 font-bold">UIN: </span>
                                <span className="text-gray-800">
                                  {userData?.studentProfile?.uin}
                                </span>
                              </div>
                            )
                          }
                        </div>

                        {/* Profile Picture */}
                        <Col xs={5} md={4} className="flex justify-end items-start rounded">
                          <Image src={BASE_URL + userData?.profile} thumbnail />
                        </Col>
                      </div>
                      <div className="grid grid-cols-2">
                        {/* resume upload  */}
                        <UploadResume fetchCurrentUserData={fetchCurrentUserData} /> {/* passing function to update userData */}
                        {
                          (userData?.studentProfile?.resume?.filepath !== "undefined") && (
                            <div className="py-2 px-2">
                              <span className='bg-blue-500 py-1 pr-2 rounded cursor-pointer hover:bg-blue-700'>
                                <a href={BASE_URL + userData?.studentProfile?.resume?.filepath} target='_blanck' className='no-underline text-white'>
                                  <i className="fa-regular fa-eye px-2" />
                                  View Resume
                                </a>
                              </span>
                              <p className='text-sm text-gray-500 mt-1'>{userData?.studentProfile?.resume?.filename}</p>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>

                  {/* college info  */}
                  <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 max-md:col-span-2">
                    <span className='text-2xl max-sm:text-xl'>College Information</span>
                    <div className="grid grid-cols-2">
                      {/* semester sgpa  */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className=" py-3 flex flex-wrap gap-2">
                          <FloatingLabel controlId="floatingSem1" label="Sem 1">
                            <Form.Control
                              type="number"
                              placeholder="Sem 1"
                              name='sem1'
                              step="0.01"
                              value={userData?.studentProfile?.SGPA?.sem1}
                              onChange={handleDataChangeForSGPA}
                            />
                          </FloatingLabel>
                          <FloatingLabel controlId="floatingSem2" label="Sem 2">
                            <Form.Control
                              type="number"
                              placeholder="Sem 2"
                              name='sem2'
                              step="0.01"
                              value={userData?.studentProfile?.SGPA?.sem2}
                              onChange={handleDataChangeForSGPA}
                            />
                          </FloatingLabel>
                          <FloatingLabel controlId="floatingSem3" label="Sem 3">
                            <Form.Control
                              type="number"
                              placeholder="Sem 3"
                              name='sem3'
                              step="0.01"
                              value={userData?.studentProfile?.SGPA?.sem3}
                              onChange={handleDataChangeForSGPA}
                            />
                          </FloatingLabel>
                          <FloatingLabel controlId="floatingSem4" label="Sem 4">
                            <Form.Control
                              type="number"
                              placeholder="Sem 4"
                              name='sem4'
                              step="0.01"
                              value={userData?.studentProfile?.SGPA?.sem4}
                              onChange={handleDataChangeForSGPA}
                            />
                          </FloatingLabel>
                        </div>
                        <div className=" py-3 flex flex-wrap gap-2">
                          <FloatingLabel controlId="floatingSem5" label="Sem 5">
                            <Form.Control
                              type="number"
                              placeholder="Sem 5"
                              name='sem5'
                              step="0.01"
                              value={userData?.studentProfile?.SGPA?.sem5}
                              onChange={handleDataChangeForSGPA}
                            />
                          </FloatingLabel>
                          <FloatingLabel controlId="floatingSem6" label="Sem 6">
                            <Form.Control
                              type="number"
                              placeholder="Sem 6"
                              name='sem6'
                              step="0.01"
                              value={userData?.studentProfile?.SGPA?.sem6}
                              onChange={handleDataChangeForSGPA}
                            />
                          </FloatingLabel>
                          <FloatingLabel controlId="floatingSem7" label="Sem 7">
                            <Form.Control
                              type="number"
                              placeholder="Sem 7"
                              name='sem7'
                              step="0.01"
                              value={userData?.studentProfile?.SGPA?.sem7}
                              onChange={handleDataChangeForSGPA}
                            />
                          </FloatingLabel>
                          <FloatingLabel controlId="floatingSem8" label="Sem 8">
                            <Form.Control
                              type="number"
                              placeholder="Sem 8"
                              name='sem8'
                              step="0.01"
                              value={userData?.studentProfile?.SGPA?.sem8}
                              onChange={handleDataChangeForSGPA}
                            />
                          </FloatingLabel>
                        </div>
                      </div>

                      {/* current year, live kt and any gap  */}
                      <div className="px-2 py-3 flex flex-col gap-3">
                        <FloatingLabel controlId="floatingSelectYear" label="Current Year">
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
                          >
                            <option disabled value="undefined" className='text-gray-400'>Enter Current Year</option>
                            <option value="1">1st</option>
                            <option value="2">2nd</option>
                            <option value="3">3rd</option>
                            <option value="4">4th</option>
                          </Form.Select>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingLiveKT" label="Live KT's">
                          <Form.Control
                            type="number"
                            placeholder="Live KT's"
                            name='liveKT'
                            value={userData?.studentProfile?.liveKT || 0}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  liveKT: e.target.value
                                }
                              });
                            }}
                          />
                        </FloatingLabel>
                        <Form.Check
                          type="switch"
                          id="gap"
                          checked={userData?.studentProfile?.gap === "true" || userData?.studentProfile?.gap === true}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              studentProfile: {
                                ...userData?.studentProfile,
                                gap: e.target.checked
                              }
                            });
                          }}
                          name='gap'
                          label="Any Gap"
                        />
                        {
                          cgpa !== "NaN" &&
                          <div className='mt-4 text-2xl text-green-500 font-bold'>
                            <span className=''>CGPA: </span>
                            <span className=''>
                              {cgpa}
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                  </div>

                  {/* past qualification  */}
                  <div className="col-span-2 backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6">
                    <span className='text-2xl max-sm:text-xl'>Past Qualification</span>
                    <div className="grid grid-cols-3 max-sm:grid-cols-1">
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
                          >
                            <option disabled value="undefined" className='text-gray-400'>Enter Your SSC Board Name</option>
                            <option value="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)">Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)</option>
                            <option value="Central Board of Secondary Education (CBSE)">Central Board of Secondary Education (CBSE)</option>
                            <option value="Council for the Indian School Certificate Examinations (CISCE)">Council for the Indian School Certificate Examinations (CISCE)</option>
                            <option value="NoHSC">No HSC</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingHSCMarks" label="HSC Percentage">
                          <Form.Control
                            type="number"
                            placeholder="HSC Percentage"
                            name='hscPercentage'
                            value={userData?.studentProfile?.pastQualification?.hsc?.percentage || ""}
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
                          />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingSelectHSCPassingYear" label="HSC Passing Year">
                          <Form.Control
                            type="number"
                            placeholder="HSC Passing Year"
                            name='hscPassingYear'
                            value={userData?.studentProfile?.pastQualification?.hsc?.year || ""}
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
                          />
                        </FloatingLabel>
                      </div>

                      <div className="px-2 py-3 flex flex-col gap-2">
                        <FloatingLabel controlId="floatingSelectDiploma" label="Diploma Board Name">
                          <Form.Select
                            aria-label="Floating label select Diploma Board"
                            className='cursor-pointer'
                            name='diplomaBoard'
                            value={userData?.studentProfile?.pastQualification?.diploma?.board || "undefined"}
                            onChange={(e) => {
                              setUserData({
                                ...userData,
                                studentProfile: {
                                  ...userData?.studentProfile,
                                  pastQualification: {
                                    ...userData?.studentProfile?.pastQualification,
                                    diploma: {
                                      ...userData?.studentProfile?.pastQualification?.diploma,
                                      board: e.target.value
                                    }
                                  }
                                }
                              });
                            }}
                          >
                            <option disabled value="undefined" className='text-gray-400'>Enter Your Diploma University Name</option>
                            <option value="Mumbai University">Mumbai University</option>
                            <option value="NoDiploma">No Diploma</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingDiplomaMarks" label="Diploma CGPA">
                          <Form.Control
                            type="number"
                            placeholder="Diploma Percentage"
                            name='diplomaPercentage'
                            value={userData?.studentProfile?.pastQualification?.diploma?.percentage || ""}
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
                          />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingSelectDiplomaPassingYear" label="Diploma Passing Year">
                          <Form.Control
                            type="number"
                            placeholder="Diploma Passing Year"
                            name='diplomaPassingYear'
                            value={userData?.studentProfile?.pastQualification?.diploma?.year || ""}
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
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="flex flex-col justify-center items-center gap-2"
                  onMouseOver={(e) => {
                    e.target.querySelector('Button i').classList.add('fa-beat');
                  }}
                  onMouseLeave={(e) => {
                    e.target.querySelector('Button i').classList.remove('fa-beat');
                  }}
                >
                  <Button variant="primary" type='submit' size='lg'>
                    <i className="fa-regular fa-floppy-disk mr-2" />
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </>
        )
      }
    </>
  )
}
export default UpdatePlacementProfile

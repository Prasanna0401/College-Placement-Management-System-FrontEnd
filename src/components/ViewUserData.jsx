import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Toast from './Toast';
import { BASE_URL } from '../config/config';

function ViewUserData() {
  document.title = 'CPMS | User Details';
  const navigate = useNavigate();

  // userId but its userId
  const { userId } = useParams();

  // userData to store user data get from userId
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [currentUserData, setCurrentUserData] = useState('');

  // count of interview
  const [placement, setPlacement] = useState({});

  // if student placed then job details
  const [jobDetail, setJobDetail] = useState({});
  const [company, setCompany] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true); // Set loading to true when the process starts

        const token = localStorage.getItem('token');

        // Fetch current user data
        const currentUserResponse = axios.get(`${BASE_URL}/user/detail`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch student data using userId
        const studentDataResponse = axios.get(`${BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Await both responses simultaneously
        const [currentUserDataRes, studentDataRes] = await Promise.all([
          currentUserResponse,
          studentDataResponse,
        ]);

        setCurrentUserData(currentUserDataRes.data);
        setUserData(studentDataRes.data);

        if (studentDataRes.data?.studentProfile?.appliedJobs) {
          const appliedJobs = studentDataRes.data.studentProfile.appliedJobs;

          // Count interview and rejection statuses
          const interviewCount = appliedJobs.filter((app) => app.status === "interview").length;
          const rejectCount = appliedJobs.filter((app) => app.status === "rejected").length;

          // Check if the student has been hired
          const hiredJob = appliedJobs.find((app) => app.status === "hired");

          // Set placement state
          setPlacement({
            interview: interviewCount,
            reject: rejectCount,
            isPlaced: !!hiredJob,
            packageOffered: hiredJob ? hiredJob.package : null,
            jobId: hiredJob ? hiredJob.jobId._id : null,
          });
        }

        // Fetch job details if the student has a job placement
        if (placement.jobId) {
          const jobDetailResponse = await axios.get(`${BASE_URL}/tpo/job/${placement.jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJobDetail(jobDetailResponse.data);

          // Fetch company details based on job's company
          if (jobDetailResponse.data.company) {
            const companyResponse = await axios.get(`${BASE_URL}/company/company-data?companyId=${jobDetailResponse.data.company}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCompany(companyResponse.data.company);
          }
        }

      } catch (error) {
        if (error.response?.data) {
          setToastMessage(error.response.data.msg || error.message);
          setShowToast(true);
          if (error.response.data.msg === "Student not found" || "user not found") {
            navigate("../404");
          }
        } else {
          console.error("Error fetching data", error);
        }
      } finally {
        // Once all operations are done, set loading to false
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId, placement.jobId, placement.companyId]);

  // console.log(typeof(userData?.studentProfile?.interships?.length))

  return (
    <>
      {
        loading ? (
          <>
            <div className="flex justify-center h-72 items-center">
              <i className="fa-solid fa-spinner fa-spin text-3xl" />
            </div>
          </>
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

            <div className="my-8 grid grid-cols-2 gap-4 text-base max-sm:text-sm max-md:grid-cols-1">
              <div className="backdrop-blur-md bg-white/30 border border-gray-200 rounded-lg shadow p-6 h-fit max-md:p-3">
                <h3 className="text-2xl max-md:text-xl font-semibold text-gray-800 mb-4">Personal Details</h3>
                <div className="grid grid-cols-2 max-md:grid-cols-1">
                  {/* Personal Info */}
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
                      userData?.gender && (
                        <div>
                          <span className="text-gray-700 font-bold">Gender: </span>
                          <span className="text-gray-800">
                            {userData?.gender}
                          </span>
                        </div>
                      )
                    }
                    {
                      userData?.dateOfBirth && (
                        <div>
                          <span className="text-gray-700 font-bold">Date of Birth: </span>
                          <span className="text-gray-800">
                            {new Date(userData?.dateOfBirth).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      )
                    }

                    {
                      userData?.fullAddress && (
                        <div>
                          <span className="text-gray-700 font-bold">Address: </span>
                          <span className="text-gray-800">
                            {userData?.fullAddress?.address + " - " + userData?.fullAddress?.pincode}
                          </span>
                        </div>
                      )
                    }
                    <div>
                      <span className="text-gray-700 font-bold">Joined On: </span>
                      <span className="text-gray-800">
                        {new Date(userData?.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {
                      userData?.studentProfile?.isApproved && (
                        <div>
                          <span className="text-gray-700 font-bold">Is Student Approved: </span>
                          <span className="text-gray-800">
                            {userData?.studentProfile?.isApproved === true ? "Yes" : "No"}
                          </span>
                        </div>
                      )
                    }
                  </div>

                  <div className="flex flex-col justify-start items-end max-md:items-center max-md:mt-1">
                    {/* Profile Picture */}
                    <Col xs={6} md={9} className=" flex justify-end rounded">
                      <Image src={BASE_URL + userData?.profile} thumbnail />
                    </Col>
                    {
                      (userData?.studentProfile?.resume?.filepath !== "undefined" && userData?.role === 'student') && (
                        <div className="py-2 px-2  max-sm:text-sm">
                          <span className='bg-blue-500 py-1 pr-2 rounded cursor-pointer hover:bg-blue-700'>
                            <a href={BASE_URL + userData?.studentProfile?.resume?.filepath} target='_blanck' className='no-underline text-white'>
                              <i className="fa-regular fa-eye px-2" />
                              View Resume
                            </a>
                          </span>
                          <p className='text-sm max-sm:text-xs text-gray-500 mt-1'>{userData?.studentProfile?.resume?.filename}</p>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>


              {
                userData?.role === "student" && (
                  <>
                    {/* placement status  */}
                    <div className={`backdrop-blur-md bg-white/30 border border-gray-200 rounded-lg shadow p-6 h-fit ${placement?.isPlaced === true ? 'bg-green-200' : 'bg-red-200'} max-md:p-3`}>
                      <div className=''>
                        <h3 className="text-2xl max-md:text-xl font-semibold text-gray-800 mb-4">Placement Status</h3>
                        <div className="grid gap-1">
                          {/* placement status  */}
                          <div className="grid">
                            <div className="grid grid-flow-col">
                              <div className="space-y-4">
                                <div>
                                  {/* No. of jobs applied  */}
                                  <span className="text-gray-700 font-bold">No. of Jobs Applied: </span>
                                  <span className="text-gray-800">
                                    {userData?.studentProfile?.appliedJobs?.length}
                                  </span>
                                </div>
                                <div>
                                  {/* No. of interview */}
                                  <span className="text-gray-700 font-bold">No. of Interview: </span>
                                  <span className="text-gray-800">
                                    {placement?.interview}
                                  </span>
                                </div>
                                <div>
                                  {/* No. of rejection */}
                                  <span className="text-gray-700 font-bold">No. of Rejection: </span>
                                  <span className="text-gray-800">
                                    {placement?.reject}
                                  </span>
                                </div>
                              </div>
                              <div className='space-y-2'>
                                <div>
                                  {/* Is Placed */}
                                  <span className="text-gray-700 font-bold">Is Placed?: </span>
                                  <span className="text-gray-800">
                                    {placement?.isPlaced === true
                                      ? <b className='text-green-500'>Yes</b>
                                      : <b className='text-red-500'>No</b>}
                                  </span>
                                </div>
                                {
                                  placement?.isPlaced === true && (
                                    <>
                                      <div>
                                        {/* If Placed then package? */}
                                        <span className="text-gray-700 font-bold">Package: </span>
                                        <span className="text-gray-800">
                                          {placement?.packageOffered + " LPA"}
                                        </span>
                                      </div>
                                      <div>
                                        {/* company details */}
                                        <span className="text-gray-700 font-bold">Company Name: </span>
                                        <span className="text-gray-800">
                                          {company?.companyName}
                                        </span>
                                      </div>
                                      <div>
                                        {/* Job Title */}
                                        <span className="text-gray-700 font-bold">Job Title: </span>
                                        <span className="text-gray-800">
                                          {jobDetail?.jobTitle}
                                        </span>
                                      </div>
                                    </>
                                  )
                                }
                              </div>
                            </div>
                            {placement?.isPlaced !== true && (
                              <>
                                <div className="my-2">
                                  <Accordion flush className='flex flex-col gap-4'>
                                    <Accordion.Item eventKey={'0'} className='shadow-md'>
                                      <Accordion.Header>Job Applied Detail</Accordion.Header>
                                      <Accordion.Body>
                                        <Table striped borderless hover sixe='sm'>
                                          <thead>
                                            <tr>
                                              <th style={{ width: "5%" }}>#</th>
                                              <th style={{ width: "20%" }}>Company Name</th>
                                              <th style={{ width: "20%" }}>Job Title</th>
                                              <th style={{ width: "20%" }}>Current Round</th>
                                              <th style={{ width: "15%" }}>Round Status</th>
                                              <th style={{ width: "10%" }}>Status</th>
                                              <th style={{ width: "10%" }}>Applied On</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {
                                              userData?.studentProfile?.appliedJobs?.length > 0 ? (
                                                userData?.studentProfile?.appliedJobs?.map((job, index) => {
                                                  const applicant = job.jobId?.applicants?.find(applicant => applicant.studentId === userData._id);
                                                  return (
                                                    <>
                                                      <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{job?.jobId?.company?.companyName || '-'}</td>
                                                        <td>{job?.jobId?.jobTitle || '-'}</td>
                                                        <td>
                                                          {applicant?.currentRound
                                                            ? applicant.currentRound.charAt(0).toUpperCase() + applicant.currentRound.slice(1)
                                                            : '-'}
                                                        </td>
                                                        <td>
                                                          {applicant?.roundStatus
                                                            ? applicant.roundStatus.charAt(0).toUpperCase() + applicant.roundStatus.slice(1)
                                                            : '-'}
                                                        </td>
                                                        <td>{job?.status ? job?.status.charAt(0).toUpperCase() + job?.status.slice(1) : '-'}</td>
                                                        <td>
                                                          {new Date(job?.appliedAt.split('T')[0]).toLocaleDateString('en-IN') || '-'}
                                                        </td>
                                                      </tr>
                                                    </>
                                                  )
                                                })
                                              ) : (
                                                <tr>
                                                  <td colSpan={7}>Not Yet Applied Any Job!</td>
                                                </tr>
                                              )
                                            }

                                          </tbody>
                                        </Table>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  </Accordion>
                                </div>
                              </>
                            )
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              }



              {
                // if user profile completed and role is of student only 
                (userData?.isProfileCompleted === true && userData?.role === 'student') && (
                  <>
                    <div className="backdrop-blur-md bg-white/30 border border-gray-200 rounded-lg shadow p-6 max-md:p-3">
                      <div className=''>
                        <h3 className="text-2xl max-md:text-xl font-semibold text-gray-800 mb-4">College Information</h3>

                        <div className="grid gap-1">
                          {/* College Information */}
                          <div className="grid grid-flow-col">
                            <div className="space-y-4">
                              {
                                userData?.studentProfile?.UIN && (
                                  <div>
                                    <span className="text-gray-700 font-bold">UIN: </span>
                                    <span className="text-gray-800">
                                      {userData?.studentProfile?.UIN}
                                    </span>
                                  </div>
                                )
                              }
                              {
                                userData?.studentProfile?.rollNumber && (
                                  <div>
                                    <span className="font-bold text-gray-700">Roll Number: </span>
                                    <span className="text-gray-800">
                                      {userData?.studentProfile?.rollNumber}
                                    </span>
                                  </div>

                                )
                              }
                              {
                                userData?.studentProfile?.department && (
                                  <div>
                                    <span className="font-bold text-gray-700">Department: </span>
                                    <span className="text-gray-800">
                                      {userData?.studentProfile?.department + " "}
                                      Engineering
                                    </span>
                                  </div>
                                )
                              }
                              {
                                userData?.studentProfile?.year && (
                                  <div>
                                    <span className="text-gray-700 font-bold">Year: </span>
                                    <span className="text-gray-800">
                                      {userData?.studentProfile?.year}
                                      {userData?.studentProfile?.year === 1 && 'st'}
                                      {userData?.studentProfile?.year === 2 && 'nd'}
                                      {userData?.studentProfile?.year === 3 && 'rd'}
                                      {userData?.studentProfile?.year === 4 && 'th'}
                                    </span>
                                  </div>
                                )
                              }
                              {
                                userData?.studentProfile?.addmissionYear && (
                                  <div>
                                    <span className="font-bold text-gray-700 ">Addmission Year: </span>
                                    <span className="text-gray-800">
                                      {userData?.studentProfile?.addmissionYear}
                                    </span>
                                  </div>
                                )
                              }
                              <div>
                                <span className="font-bold text-gray-700 ">Live KT's: </span>
                                <span className="text-gray-800">
                                  {userData?.studentProfile?.liveKT || 0}
                                </span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-700 ">Any Gap: </span>
                                <span className="text-gray-800">
                                  {userData?.studentProfile?.gap === true ? "Yes" : "No"}
                                </span>
                              </div>
                            </div>

                            {
                              userData?.studentProfile?.SGPA && (
                                <>
                                  <div className="flex flex-col gap-3">
                                    <div className="font-bold">SGPA:</div>
                                    <div className="flex gap-6 justify-center items-start max-sm:flex-col max-sm:gap-3">
                                      <div className="space-y-6 max-sm:space-y-3">
                                        {
                                          userData?.studentProfile?.SGPA?.sem1 && (
                                            <div className='border-2 px-2 rounded transition-all duration-200 cursor-pointer hover:scale-125 hover:bg-green-200'>
                                              <span className="text-gray-700 font-bold">Sem I: </span>
                                              <span className="text-gray-800">
                                                {userData?.studentProfile?.SGPA?.sem1}
                                              </span>
                                            </div>
                                          )
                                        }
                                        {
                                          userData?.studentProfile?.SGPA?.sem2 && (
                                            <div className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125 hover:bg-green-200'>
                                              <span className="font-bold text-gray-700">Sem II: </span>
                                              <span className="text-gray-800">
                                                {userData?.studentProfile?.SGPA?.sem2}
                                              </span>
                                            </div>

                                          )
                                        }
                                        {
                                          userData?.studentProfile?.SGPA?.sem3 && (
                                            <div className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125 hover:bg-green-200'>
                                              <span className="font-bold text-gray-700">Sem III: </span>
                                              <span className="text-gray-800">
                                                {userData?.studentProfile?.SGPA?.sem3}
                                              </span>
                                            </div>
                                          )
                                        }
                                        {
                                          userData?.studentProfile?.SGPA?.sem4 && (
                                            <div className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125 hover:bg-green-200'>
                                              <span className="text-gray-700 font-bold">Sem IV: </span>
                                              <span className="text-gray-800">
                                                {userData?.studentProfile?.SGPA?.sem4}
                                              </span>
                                            </div>
                                          )
                                        }
                                      </div>
                                      <div className="space-y-6 max-sm:space-y-3">
                                        {
                                          userData?.studentProfile?.SGPA?.sem5 && (
                                            <div className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125 hover:bg-green-200'>
                                              <span className="font-bold text-gray-700 ">Sem V: </span>
                                              <span className="text-gray-800">
                                                {userData?.studentProfile?.SGPA?.sem5}
                                              </span>
                                            </div>
                                          )
                                        }
                                        {
                                          userData?.studentProfile?.SGPA?.sem6 && (
                                            <div className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125 hover:bg-green-200'>
                                              <span className="font-bold text-gray-700 ">Sem VI: </span>
                                              <span className="text-gray-800">
                                                {userData?.studentProfile?.SGPA?.sem6}
                                              </span>
                                            </div>
                                          )
                                        }
                                        {
                                          userData?.studentProfile?.SGPA?.sem7 && (
                                            <div className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125 hover:bg-green-200'>
                                              <span className="font-bold text-gray-700 ">Sem VII: </span>
                                              <span className="text-gray-800">
                                                {userData?.studentProfile?.SGPA?.sem7}
                                              </span>
                                            </div>
                                          )
                                        }
                                        {
                                          userData?.studentProfile?.SGPA?.sem8 && (
                                            <div className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125 hover:bg-green-200'>
                                              <span className="font-bold text-gray-700 ">Sem VII: </span>
                                              <span className="text-gray-800">
                                                {userData?.studentProfile?.SGPA?.sem8}
                                              </span>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              }


              {
                (userData?.studentProfile?.pastQualification && userData?.role === 'student') && (
                  <>
                    <div className="backdrop-blur-md bg-white/30 border border-gray-200 rounded-lg shadow p-6 h-fit max-md:p-3">
                      <div className=''>
                        <h3 className="text-2xl max-md:text-xl font-semibold text-gray-800 mb-4">Past Qualification</h3>
                        <div className="grid gap-4">
                          {/* past Qualification ssc */}
                          {
                            userData?.studentProfile?.pastQualification?.ssc && (
                              <>
                                <div className="">
                                  <div className="font-bold">
                                    SSC:
                                  </div>
                                  <div className="space-y-1 pl-2">
                                    {
                                      userData?.studentProfile?.pastQualification?.ssc?.board && (
                                        <div>
                                          <span className="text-gray-700 font-bold">Board: </span>
                                          <span className="text-gray-800">
                                            {userData?.studentProfile?.pastQualification?.ssc?.board}
                                          </span>
                                        </div>
                                      )
                                    }
                                    {
                                      userData?.studentProfile?.pastQualification?.ssc?.year && (
                                        <div>
                                          <span className="font-bold text-gray-700">Passing Year: </span>
                                          <span className="text-gray-800">
                                            {userData?.studentProfile?.pastQualification?.ssc?.year}
                                          </span>
                                        </div>

                                      )
                                    }
                                    {
                                      userData?.studentProfile?.pastQualification?.ssc?.percentage && (
                                        <div>
                                          <span className="font-bold text-gray-700">Percentage: </span>
                                          <span className="text-gray-800">
                                            {userData?.studentProfile?.pastQualification?.ssc?.percentage + "%"}
                                          </span>
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>
                              </>
                            )
                          }
                          {/* past Qualification hsc */}
                          {
                            userData?.studentProfile?.pastQualification?.hsc && (
                              <>
                                <div className="">
                                  <div className="font-bold">
                                    HSC:
                                  </div>
                                  <div className="space-y-1 pl-2">
                                    {
                                      userData?.studentProfile?.pastQualification?.hsc?.board && (
                                        <div>
                                          <span className="text-gray-700 font-bold">Board: </span>
                                          <span className="text-gray-800">
                                            {userData?.studentProfile?.pastQualification?.hsc?.board}
                                          </span>
                                        </div>
                                      )
                                    }
                                    {
                                      userData?.studentProfile?.pastQualification?.hsc?.year && (
                                        <div>
                                          <span className="font-bold text-gray-700">Passing Year: </span>
                                          <span className="text-gray-800">
                                            {userData?.studentProfile?.pastQualification?.hsc?.year}
                                          </span>
                                        </div>

                                      )
                                    }
                                    {
                                      userData?.studentProfile?.pastQualification?.hsc?.percentage && (
                                        <div>
                                          <span className="font-bold text-gray-700">Percentage: </span>
                                          <span className="text-gray-800">
                                            {userData?.studentProfile?.pastQualification?.hsc?.percentage + "%"}
                                          </span>
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>
                              </>
                            )
                          }
                          {/* past Qualification diploma */}
                          {
                            userData?.studentProfile?.pastQualification?.diploma && (
                              <>
                                <div className="">
                                  <div className="font-bold">
                                    Diploma:
                                  </div>
                                  <div className="space-y-4 pl-2">
                                    {
                                      userData?.studentProfile?.pastQualification?.diploma?.department && (
                                        <div>
                                          <span className="text-gray-700 font-bold">Board: </span>
                                          <span className="text-gray-800">
                                            {userData?.studentProfile?.pastQualification?.diploma?.department}
                                          </span>
                                        </div>
                                      )
                                    }
                                    {
                                      userData?.studentProfile?.pastQualification?.diploma?.year && (
                                        <div>
                                          <span className="font-bold text-gray-700">Passing Year: </span>
                                          <span className="text-gray-800">
                                            {userData?.studentProfile?.pastQualification?.diploma?.year}
                                          </span>
                                        </div>

                                      )
                                    }
                                    {
                                      userData?.studentProfile?.pastQualification?.diploma?.percentage && (
                                        <div>
                                          <span className="font-bold text-gray-700">Percentage: </span>
                                          <span className="text-gray-800">
                                            {userData?.studentProfile?.pastQualification?.diploma?.percentage}
                                          </span>
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>
                              </>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </>
                )
              }


              {/* Internship details  */}
              {
                (userData?.studentProfile?.internships && userData.studentProfile.internships.length !== 0) && (
                  <div className="col-span-2 backdrop-blur-md bg-white/30 border border-gray-200 rounded-lg shadow p-6 h-fit max-md:p-3 max-md:col-span-1">
                    <div className=''>
                      <div className="flex justify-between">
                        <h3 className="text-2xl max-md:text-xl font-semibold text-gray-800 mb-4">Internship Details</h3>
                        <h5 className='text-xl font-semibold text-gray-800 mb-4'>
                          ({userData?.studentProfile?.internships?.length || 0})
                        </h5>
                      </div>

                      <div className="grid gap-1">
                        {/* Internship details  */}
                        <div className=''>

                          <Accordion defaultActiveKey={['1']} flush className='flex flex-col gap-4'>
                            <Accordion.Item eventKey={'1'} className='shadow-md'>
                              <Accordion.Header>Job Applied Detail</Accordion.Header>
                              <Accordion.Body>
                                <Table striped borderless hover>
                                  <thead>
                                    <tr>
                                      <th style={{ width: "5%" }}>#</th>
                                      <th style={{ width: "25%" }}>Company Name</th>
                                      <th style={{ width: "25%" }}>Company Website</th>
                                      <th style={{ width: "15%" }}>Internship Type</th>
                                      <th style={{ width: "15%" }}>Duration</th>
                                      <th style={{ width: "15%" }}>Monthly Stipend</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      userData?.studentProfile?.internships?.map((internship, index) => (
                                        <tr key={internship._id}>
                                          <td>{index + 1}</td>
                                          <td>{internship?.companyName}</td>
                                          <td>
                                            <a
                                              href={internship?.companyWebsite}
                                              target='_blanck'
                                              className='no-underline text-blue-500 hover:text-blue-700'
                                            >
                                              {internship?.companyWebsite || '-'}
                                            </a>
                                          </td>
                                          <td>{internship?.type || '-'}</td>
                                          <td>{internship?.internshipDuration + " days" || '-'}</td>
                                          <td>
                                            {internship?.monthlyStipend ? `Rs. ${internship?.monthlyStipend}` : '-'}
                                          </td>
                                        </tr>
                                      ))
                                    }
                                  </tbody>
                                </Table>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>



                        </div>

                      </div>
                    </div>
                  </div>
                )
              }










            </div >
          </>
        )
      }
    </>
  )
}

export default ViewUserData

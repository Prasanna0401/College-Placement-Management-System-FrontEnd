import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import TablePlaceholder from './TablePlaceholder';
import { BASE_URL } from '../config/config';

function AddUserTable({
  users,
  loading,
  handleDeleteUser,
  formOpen,
  setFormOpen,
  data,
  handleDataChange,
  handleSubmit,
  userToAdd,
  handleApproveStudent
}) {

  // useState for load data
  const [currentUser, setCurrentUser] = useState({
    name: 'Not Found',
    email: 'Not Found',
    profile: 'Profile Img',
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
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
      });
  }, []);

  {/* for hover label effect  */ }
  const renderTooltipDeleteUser = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete User
    </Tooltip>
  );
  const renderTooltipApproveUser = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Approve User
    </Tooltip>
  );

  const nameLink = () => {

  }


  return (
    <>
      <div className=''>
        {
          loading ? (
            // fake table loading animation 
            <div>
              <TablePlaceholder />
              {/* <i className="fa-solid fa-spinner fa-spin text-3xl" /> */}
            </div>
          ) : (
            <Table striped bordered hover className='bg-white my-6 rounded-lg shadow w-full text-base max-sm:text-sm'>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Sr. No.</th>
                  <th style={{ width: '15%' }}>Name</th>
                  <th style={{ width: '25%' }}>Email</th>
                  <th style={{ width: '15%' }}>Phone Number</th>
                  <th style={{ width: '20%' }}>Date of Joining</th>
                  <th style={{ width: '15%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user?.email}>
                      <td>{index + 1}</td>
                      <td>
                        {user && (
                          <Link
                            to={
                              currentUser.role === "superuser"
                                ? `/admin/user/${user?._id}`
                                : currentUser.role === "management_admin"
                                  ? `/management/user/${user?._id}`
                                  : currentUser.role === "tpo_admin"
                                    ? `/tpo/user/${user?._id}`
                                    : "#"
                            }
                            className="text-blue-500 no-underline hover:text-blue-700"
                          >
                            {user?.first_name + " "}
                            {user?.last_name && user?.last_name}
                          </Link>
                        )}
                      </td>
                      <td>
                        <Link to={`mailto:${user.email}`} className='no-underline'>
                          {user.email}
                        </Link>
                      </td>
                      <td>{user.number}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        {/* for hover label effect  */}
                        <div className="">
                          {
                            userToAdd === 'approve-student' ? (
                              <div className="flex justify-around items-center gap-1 max-sm:flex-col">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={renderTooltipDeleteUser}
                                >
                                  <i
                                    className="fa-solid fa-circle-xmark text-2xl max-sm:text-lg cursor-pointer hover:text-red-500"
                                    onClick={() => handleDeleteUser(user.email)}
                                    onMouseEnter={(e) => {
                                      e.target.classList.remove('fa-solid');
                                      e.target.classList.add('fa-regular');
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.classList.remove('fa-regular');
                                      e.target.classList.add('fa-solid');
                                    }}
                                  />
                                </OverlayTrigger >
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={renderTooltipApproveUser}
                                >
                                  <i
                                    className="fa-solid fa-square-check text-2xl max-sm:text-lg cursor-pointer hover:text-green-500"
                                    onClick={() => handleApproveStudent(user.email)}
                                    onMouseEnter={(e) => {
                                      e.target.classList.remove('fa-solid');
                                      e.target.classList.add('fa-regular');
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.classList.remove('fa-regular');
                                      e.target.classList.add('fa-solid');
                                    }}
                                  />
                                </OverlayTrigger >
                              </div>

                            ) : (
                              <div className="">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={renderTooltipDeleteUser}
                                >
                                  <i
                                    className="fa-regular fa-trash-can text-2xl cursor-pointer hover:text-red-500"
                                    onClick={() => handleDeleteUser(user.email)}
                                    onMouseEnter={(e) => {
                                      e.target.classList.add('fa-solid');
                                      e.target.classList.remove('fa-regular');
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.classList.add('fa-regular');
                                      e.target.classList.remove('fa-solid');
                                    }}
                                  />
                                </OverlayTrigger >
                              </div>
                            )
                          }
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )
        }

        {/* checking if approve student user page is open or not */}
        {/* {
          userToAdd !== "approve-student" && (
            <Button variant="dark" size="lg" onClick={() => setFormOpen(true)}>
              <i className="fa-solid fa-person-circle-plus px-1" /> Add {userToAdd}
            </Button>
          )
        }


        {
          formOpen &&
          <>
            <div className="bg-white flex justify-center w-full mt-4">
              <div className='w-1/2 rounded-lg shadow px-10 py-3'>
                <Form className='text-base' onSubmit={handleSubmit}>
                  <h2>New {userToAdd}</h2>
                  <FloatingLabel className='my-3' label="Name">
                    <Form.Control type="text" autoComplete="name" placeholder="Name" name='first_name' value={data.first_name || ''} onChange={handleDataChange} />
                  </FloatingLabel>
                  <FloatingLabel className='my-3' label="Email">
                    <Form.Control type="email" autoComplete="email" placeholder="Email" name='email' value={data.email || ''} onChange={handleDataChange} />
                  </FloatingLabel>
                  <FloatingLabel className='my-3' label="Number">
                    <Form.Control type="number" autoComplete="number" placeholder="Phone Number" name='number' value={data.number || ''} onChange={handleDataChange} />
                  </FloatingLabel>
                  <FloatingLabel className='my-3' label="Password">
                    <Form.Control type="password" autoComplete="password" placeholder="Enter Initial Password" name='password' value={data.password || ''} onChange={handleDataChange} />
                  </FloatingLabel>
                  <button type="submit" className="flex items-center px-3 py-2 bg-blue-500 text-white rounded">
                    <GrFormAdd className="mr-2 text-3xl" />
                    Create New {userToAdd}
                  </button>
                </Form>
              </div>
            </div>
          </>
        } */}
      </div >
    </>
  )
}

export default AddUserTable;
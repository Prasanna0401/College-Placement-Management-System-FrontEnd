import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/CPMS.png';
import isAuthenticated from '../../utility/auth.utility';
import Toast from '../../components/Toast';
import { Button } from 'react-bootstrap';
import { BASE_URL } from '../../config/config';

function LoginSuperUser() {
  document.title = 'CPMS | Admin Login';
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({});

  // if login user visit redirect to home page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("../admin/dashboard");
    }
  }, [navigate]);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') return setError({ ...error, email: '' })
    if (e.target.name === 'password') return setError({ ...error, password: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.email && !formData?.password) return setError({ email: "Email Required!", password: "Password Required!" });
    if (!formData?.email) return setError({ email: "Email Required!" });
    if (!formData?.password) return setError({ password: "Password Required!" });

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('../admin/dashboard');
    } catch (error) {
      if (error.response.data.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log("Error in admin login.jsx => ", error);
      setLoading(false);
    }
  }

  // toggle eye
  const [isEyeOpen, setEyeOpen] = useState(false);

  const handleEye = () => {
    setEyeOpen(!isEyeOpen);
  }
  return (
    <>
      {/* for any message "toast" */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-black from-5% via-slate-200 via-50% to-gray-900 to-10%">
        <form className="form-signin flex justify-center items-center flex-col gap-3 backdrop-blur-md bg-white/30 border border-white/20 rounded-lg p-8 shadow shadow-red-400 w-1/3 max-lg:w-2/3 max-md:w-3/4 max-[400px]:w-4/5" onSubmit={handleSubmit}>
          <div className='flex justify-center items-center flex-col'>
            <img className="mb-4 rounded-xl shadow w-30 h-28 lg:w-40 lg:h-40" src={`${Logo}`} alt="Logo Image" />
            <h1 className="h3 mb-3 font-weight-normal text-white">Super User Log In</h1>
          </div>
          <div className="w-full">
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input
              type="email"
              id="inputEmail"
              className="form-control ml-1"
              placeholder="Email address"
              autoFocus=""
              fdprocessedid="gwlj3s"
              autoComplete='email'
              name='email'
              value={email}
              onChange={handleChange}
            />
            {
              error?.email &&
              <div className="ml-2">
                <span className='text-red-500'>{error?.email}</span>
              </div>
            }
          </div>

          <div className="w-full">
            <div className="flex justify-center items-center w-full">
              <label htmlFor="inputPassword" className="sr-only">Password</label>
              <input
                type={`${isEyeOpen ? "text" : "password"}`}
                id="inputPassword"
                className="form-control"
                placeholder="Password"
                fdprocessedid="9sysne"
                autoComplete='current-password'
                name='password'
                value={password}
                onChange={handleChange}
              />
              <i className={`${isEyeOpen ? "fa-solid fa-eye" : "fa-regular fa-eye-slash"} -ml-6 cursor-pointer`} onClick={handleEye}></i>
            </div>
            {
              error?.password &&
              <div className="ml-2">
                <span className='text-red-500'>{error?.password}</span>
              </div>
            }
          </div>

          <div className="flex justify-center items-center flex-col">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Log In'}
            </Button>
          </div>
          <p className="text-muted text-center text-gray-400">© College Placement Management System 2024 - 25</p>
        </form>
      </div>
    </>
  )
}

export default LoginSuperUser

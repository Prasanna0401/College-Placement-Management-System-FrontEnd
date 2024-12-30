import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import Loading from "./Loading";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [load, setLoad] = useState(true);

  // const [load, setLoad] = useState(true);

  const redirectUser = () => {
    if (!user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    // check if any user trying another users request
    if (!allowedRoles.includes(user.role)) {
      // console.log(user.role);
      if (user.role === 'student') navigate("/student/dashboard", { replace: true })
      else if (user.role === 'tpo_admin') navigate("/tpo/dashboard")
      else if (user.role === 'management_admin') navigate("/management/dashboard", { replace: true })
      else if (user.role === 'superuser') navigate("/admin/dashboard")
      else navigate("/404")

      return;
    }
    setLoad(false);
  }

  useEffect(() => {
    redirectUser();

  }, [loading, navigate, user, allowedRoles]);

  // if (!(user && allowedRoles.includes(user.role))) {
  //   navigate('../404');    
  // }

  useEffect(() => {
    if (user.isProfileCompleted === 'false') {
      if (user.role === 'student') navigate(`/student/complete-profile/${user.id}`);
      if (user.role === 'tpo_admin') navigate(`/tpo/complete-profile/${user.id}`);
      if (user.role === 'management_admin') navigate(`/management/complete-profile/${user.id}`);
      return;
    }
    setLoad(false);
  }, []);


  // If user has the proper role, render the children routes
  return (
    <>
      {
        (loading || load) ? (
          // <div className="flex justify-center h-72 items-center">
          //   <i className="fa-solid fa-spinner fa-spin text-3xl" />
          // </div>
          <Loading />
        ) : (
          <Outlet />
        )
      }
    </>
  )
};

export default ProtectedRoute;

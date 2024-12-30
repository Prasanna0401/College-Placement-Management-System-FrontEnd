import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link, useLocation } from 'react-router-dom';

function BreadcrumbExp({ header }) {
  const location = useLocation();

  // identifying path 
  let pathnames = location.pathname.split('/').filter(Boolean);
  // user is student, tpo, managemnet
  const userIs = pathnames[0];
  // eliminate 1st word
  pathnames = pathnames.slice(1);
  if (pathnames[0] === "dashboard") {
    pathnames = pathnames.slice(1);
  }
  // console.log(pathnames);

  return (
    <div className="flex justify-between items-center">
      <div className="">
        <span className='text-2xl'>
          {header}
        </span>
      </div>
      <Breadcrumb bsPrefix='flex'>
        {/* Home link */}
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' + userIs + "/dashboard", className: "px-1 no-underline" }}>
          Home
        </Breadcrumb.Item>

        {
          // pathnames.map((name, index) => {
          //   let routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          //   const isLast = index === pathnames.length - 1;
          //   routeTo = userIs + routeTo;
          //   if (name === "tpo")
          //     name = name.toUpperCase();
          //   // console.log(name)

          //   return isLast ? (
          //     <Breadcrumb.Item active key={name}>
          //       &nbsp;  {/* addding space */}
          //       {`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
          //     </Breadcrumb.Item>
          //   ) : (
          //     <Breadcrumb.Item linkAs={Link} linkProps={{ to: routeTo, className: "no-underline px-1" }} key={name}>
          //       {name.charAt(0).toUpperCase() + name.slice(1)}
          //     </Breadcrumb.Item>
          //   );
          // })
        }
      </Breadcrumb>
    </div>
  );
}

export default BreadcrumbExp;
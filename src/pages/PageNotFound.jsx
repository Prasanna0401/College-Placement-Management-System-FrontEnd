import React from 'react';
import { Link } from 'react-router-dom';
import Img from '../assets/404Img.jpg';

function PageNotFound() {
  document.title = 'CPMS | Page Not Found';
  return (
    <>
      <div className="flex h-screen justify-center items-center px-3 py-2 max-sm:flex-col">
        <div className="">
          <img src={Img} alt="404 cry boy Image" className='w-3/4' />
        </div>
        <div className='flex flex-col justify-center items-start gap-3'>
          <h1 className='playfair'>404</h1>
          <h2 className=''><span className='dancing text-red-500 text-5xl'>Oops!</span> Page Not found!</h2>
          <button type="button" className="btn btn-primary animate-bounce">
            <Link to='../student/login' className='text-white no-underline text-xl'>
              <i className="fa-regular fa-hand-point-right mr-2" />
              Go to home
            </Link>
          </button>
        </div>
      </div>
    </>
  )
}

export default PageNotFound

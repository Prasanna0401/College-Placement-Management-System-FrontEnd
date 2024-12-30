import React from 'react';
import LogoImg from '../assets/CPMS.png';
import LogoVid from '../assets/CPMS.mp4';

function LoadingComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full ">
      <div className="flex flex-col justify-between items-center">
        {/* <video width="350" height="350" autoPlay loop muted >
          <source src={LogoVid} type="video/mp4" />
        </video> */}
        <img src={LogoImg} alt="CPMS Logo" width="350" height="350" />
        <div className="flex items-center gap-2 mx-2">
          <div className="w-8 h-8 border-4 border-[#13325b] border-t-transparent border-solid rounded-full animate-spin"></div>
          <div className="">
            <p className="text-xl font-medium pt-3 max-sm:text-base text-[#13325b]">
              Hold your sit tightly, we are coming...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingComponent;

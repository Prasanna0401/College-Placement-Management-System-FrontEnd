import React from 'react';

function Footer({ isSidebarVisible }) {
  return (
    <>
      <div className={`bg-white bottom-0 right-0 border-t-2 border-gray-200 shadow-inner text-gray-500 transition-all duration-300 flex justify-between items-center h-fit w-full max-md:py-4 md:py-6 max-sm:text-sm ${isSidebarVisible ? 'md:ml-60 md:w-[calc(100%-15rem)] px-10' : 'ml-0 px-4'}`}>
        <div className="flex flex-col md:flex-row text-left md:items-center">
          <span className="font-semibold">Developed & Maintained by</span>
          <span className="px-1">
            <a
              href=""
              target='_blanck'
              className='cursor-pointer font-bold text-blue-500 no-underline hover:text-blue-700'
            >
              Prasanna venkatesh
            </a>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center text-right mt-2 sm:mt-0">
          <span className="font-semibold">Version</span>
          <span className="px-1">1.0.1</span>
        </div>
      </div>
    </>
  )
}
export default Footer

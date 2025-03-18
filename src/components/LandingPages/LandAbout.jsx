import About1 from '../../assets/aboutImg1.jpg';
import About2 from '../../assets/aboutImg2.jpg';
import About3 from '../../assets/aboutImg3.jpg';

function LandAbout() {
  return (
    <>
      <div id='about' className="bg-gradient-to-r from-slate-100 via-pink-100 to-orange-100">
        <h1 className='ml-12 px-3 pt-3 text-4xl'>About Us</h1>
        <div className="min-h-96 my-3 flex flex-wrap justify-around items-center gap-8">
          <div className='w-10/12 md:w-1/3 lg:w-1/4 h-5/6 bg-opacity-10 shadow-lg shadow-slate-200 bg-red-500 border border-black rounded-lg text-center'>
            {/* <h3 className='py-1'>Get Placement</h3> */}
            <div className="flex justify-center flex-col items-center py-1">
              <img src={`${About2}`} alt="Image" className='w-56 md:w-64 border-2 border-black rounded-xl' />
              <span className='mx-10 max-md:mx-0'>Placement Management System manages student information in the college with regard to placement.</span>
            </div>
          </div>
          <div className='w-10/12 lg:w-1/4 md:w-1/3 h-5/6 bg-opacity-10 shadow-lg shadow-slate-200 bg-red-500 border border-black rounded-lg text-center'>
            <h3 className='py-1'>Get Placement</h3>
            <div className="flex justify-center flex-col items-center py-1">
              <img src={`${About1}`} alt="Image" className='w-56 md:w-64 border-2 border-black rounded-xl' />
              <span className='mx-10 max-md:mx-0'>Placement Management System is a web App which provides information on placement providers and the placements and also keeps up to date information of all students.</span>
            </div>
          </div>
          <div className='w-10/12 lg:w-1/4 md:w-1/3 h-5/6 bg-opacity-10 shadow-lg shadow-slate-200 bg-red-500 border border-black rounded-lg text-center'>
            {/* <h3 className='py-1'>Get Placement</h3> */}
            <div className="flex justify-center flex-col items-center py-1">
              <img src={`${About3}`} alt="Image" className='w-56 md:w-64 border-2 border-black rounded-xl' />
              <span className='mx-10 max-md:mx-0'>Placement Management System can be accessed throughout the college with proper login provided.</span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default LandAbout

import { useNavigate } from 'react-router-dom';

function LandFooter() {
  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <footer className="py-3 my-4">
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            <li className="nav-item"><a href="#home" className="nav-link px-2 text-body-secondary">Home</a></li>
            <li className="nav-item"><a href="#about" className="nav-link px-2 text-body-secondary">About</a></li>
            <li className="nav-item"><a href="" className="nav-link px-2 text-body-secondary">Contact</a></li>
            <li className="nav-item"><a href="" className="nav-link px-2 text-body-secondary">FAQs</a></li>
          </ul>
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            <span className='text-gray-300 text-3xl'>|</span>
            <li className="nav-item">
              <span className="nav-link px-2 text-body-secondary cursor-pointer" onClick={()=>navigate('tpo/login')}>
                Login as TPO Admin
              </span>
            </li>
            <span className='text-gray-300 text-3xl'>|</span>
            <li className="nav-item">
              <span className="nav-link px-2 text-body-secondary cursor-pointer" onClick={()=>navigate('management/login')}>
                Login as Management Admin
              </span>
            </li>
            <span className='text-gray-300 text-3xl'>|</span>
          </ul>
          <p className="text-center text-body-secondary">© 2024 College Placement Management System</p>
        </footer>
      </div>
    </>
  )
}

export default LandFooter

import React, { useEffect, useState } from 'react';
import LandingNavbar from '../components/LandingPages/LandNavbar';
import LandingHeroPage from '../components/LandingPages/LandHeroPage';
import LandingAbout from '../components/LandingPages/LandAbout';
import LandFooter from '../components/LandingPages/LandFooter';
import Toast from '../components/Toast';
import { useLocation, useNavigate } from 'react-router-dom';


function LandingPage() {
  document.title = 'CPMS';
  const location = useLocation();
  const navigate = useNavigate();

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // if user came from any userContext page then this toast appears
  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };
  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      // Clear the state after the toast is shown
      navigate('.', { replace: true, state: {} });
    }
  }, []);

  return (
    <>
      {/* Toast Component */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="flex flex-col flex-wrap">
        <LandingNavbar />
        <LandingHeroPage />
        <LandingAbout />
        <LandFooter />
      </div>

    </>
  )
}

export default LandingPage

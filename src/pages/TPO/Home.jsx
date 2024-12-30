import React from 'react';
import NoticeBox from '../../components/NoticeBox';
import NotificationBox from '../../components/NotificationBox';

// tpo 
function Home() {
  document.title = 'CPMS | TPO Dashboard';
  return (
    <>
      <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        <NotificationBox />
        <NoticeBox />
      </div>
    </>
  )
}

export default Home

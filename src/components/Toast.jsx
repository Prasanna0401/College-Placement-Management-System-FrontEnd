import React, { useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const CustomToast = ({ show, onClose, message, delay = 3000, position = 'bottom-end' }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay, onClose]);

  return (
    <ToastContainer position={position} className="p-3 position-fixed bottom-0 end-0" style={{ zIndex: 1050 }}>
      <Toast onClose={onClose} show={show} delay={delay} autohide>
        <Toast.Header>
          <strong className="me-auto text-blue-500">Notification</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CustomToast;

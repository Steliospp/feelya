import { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [bookingTherapistId, setBookingTherapistId] = useState(null);
  const [profileTherapistId, setProfileTherapistId] = useState(null);

  const openBookingModal = (id) => setBookingTherapistId(id);
  const closeBookingModal = () => setBookingTherapistId(null);
  const openProfileModal = (id) => setProfileTherapistId(id);
  const closeProfileModal = () => setProfileTherapistId(null);

  return (
    <ModalContext.Provider value={{ bookingTherapistId, openBookingModal, closeBookingModal, profileTherapistId, openProfileModal, closeProfileModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
}

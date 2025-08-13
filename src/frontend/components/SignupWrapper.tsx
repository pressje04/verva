'use client';

import { useState } from 'react';
import SignupModal from './SignupModal';

export default function SignupWrapper() {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      {showModal && <SignupModal onClose={() => setShowModal(false)} />}
    </>
  );
}

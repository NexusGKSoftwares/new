import React, { useEffect, useState } from 'react';

const DelayedFallback = ({ children, delay = 5000 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [delay]);

  return show ? children : null;
};

export default DelayedFallback;

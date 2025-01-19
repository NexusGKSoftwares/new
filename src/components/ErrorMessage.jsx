import React, { useState } from 'react';
import './ErrorMessage.css'; // Optional: You can create a custom CSS file for styling

const ErrorMessage = ({ errorMessage, onReload }) => {
  const [isError, setIsError] = useState(true); // State to track error status

  const handleReload = () => {
    setIsError(false);  // Optional: Update the state to hide the error message
    onReload();  // Trigger the reload function passed as a prop
  };

  return (
    <div className="error-message-container">
      <div className="error-message-content">
        <p>{errorMessage}</p>
        {isError && (
          <button className="reload-button" onClick={handleReload}>
            Reload
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

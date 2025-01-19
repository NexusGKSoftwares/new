import React from 'react';
import './LoadingIcon.css';

const LoadingIcon = ({ 
  text = "Loading...",
  primaryColor = "#24ecff",
  secondaryColor = "#93ff2d",
  tertiaryColor = "#e41cf8"
}) => {
  return (
    <div className="loading-wrapper">
      <div className="container">
        <div 
          className="ring ring-primary"
          style={{ '--ring-color': primaryColor }}
        />
        <div 
          className="ring ring-secondary"
          style={{ '--ring-color': secondaryColor }}
        />
        <div 
          className="ring ring-tertiary"
          style={{ '--ring-color': tertiaryColor }}
        />
        {/* Apply the loading-text class to the <p> element */}
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default LoadingIcon;

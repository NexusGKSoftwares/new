import React, { useState } from 'react';
import './ProfileSection.css';
import profileImage from './assets/image.png';

const ProfileSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleEditProfile = (menu) => {
    setActiveMenu(menu);
    if (menu === 'settings') {
      toggleSettings(); 
    }
  };

  const handleLogout = () => {
    alert('Logout clicked!');
    
    
  };

  return (
    <div className="profile-section">
      <div className="profile-icon-container" onClick={toggleDropdown}>
        <img
          src={profileImage} 
          alt="Profile Icon"
          className="profile-icon"
        />
        <span className="profile-name">John Doe</span> 
      </div>
      {isDropdownOpen && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            {/* <img
              src={profileImage} 
              alt="Profile Thumbnail"
              className="profile-thumbnail"
            /> */}
            <div>
              <p className="profile-name-dropdown">John Doe</p>
              <p className="profile-email-dropdown">johndoe@example.com</p> 
            </div>
          </div>
          <ul className="profile-dropdown-list">
            <li>
              <button onClick={handleEditProfile}>Edit Profile</button>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;

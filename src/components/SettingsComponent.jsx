import React, { useState, useEffect, useContext } from 'react';
import './SettingsComponent.css';
import { ThemeContext } from '../App'; 
import LoadingIcon from './LoadingIcon';  

const SettingsComponent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [privacy, setPrivacy] = useState('everyone');
  const [profile, setProfile] = useState({
    username: '',
    profilePicture: null,
  });

  const [isSettingsVisible, setIsSettingsVisible] = useState(true);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    // Load settings from localStorage when the component mounts
    const savedSettings = JSON.parse(localStorage.getItem('settings'));
    if (savedSettings) {
      setLanguage(savedSettings.language);
      setNotifications(savedSettings.notifications);
      setSound(savedSettings.sound);
      setPrivacy(savedSettings.privacy);
      setProfile(savedSettings.profile);
    }

    return () => {
      if (profile.profilePicture) {
        URL.revokeObjectURL(profile.profilePicture);
      }
    };
  }, [profile.profilePicture]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const toggleSound = () => {
    setSound(!sound);
  };

  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value);
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];

    // Reset error and loading state
    setError(null);
    setLoading(true);

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a JPEG, PNG, or GIF image.');
      setLoading(false);
      return;
    }

    // File size validation (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Please upload an image smaller than 5MB.');
      setLoading(false);
      return;
    }

    // Resize image before setting the profile picture
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = 200;
        const scale = Math.min(maxSize / image.width, maxSize / image.height);
        const newWidth = image.width * scale;
        const newHeight = image.height * scale;

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(image, 0, 0, newWidth, newHeight);

        const resizedImageUrl = canvas.toDataURL();
        setProfile({ ...profile, profilePicture: resizedImageUrl });
        setLoading(false);
      };
    };
    reader.readAsDataURL(file);
  };

  const resetSettings = () => {
    setLanguage('en');
    setNotifications(true);
    setSound(true);
    setPrivacy('everyone');
    setProfile({ username: '', profilePicture: null });
    setIsSettingsVisible(false);
  };

  const saveSettings = () => {
    const settings = {
      language,
      notifications,
      sound,
      privacy,
      profile,
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    setIsSettingsVisible(false);
  };

  return (
    isSettingsVisible && (
      <div className="settings-overlay">
        <div className={`settings-container ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
          <span className="cancel-icon" onClick={resetSettings}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M24 3.752l-4.423-3.752-7.771 9.039-7.647-9.008-4.159 4.278c2.285 2.885 5.284 5.903 8.362 8.708l-8.165 9.447 1.343 1.487c1.978-1.335 5.981-4.373 10.205-7.958 4.304 3.67 8.306 6.663 10.229 8.006l1.449-1.278-8.254-9.724c3.287-2.973 6.584-6.354 8.831-9.245z" />
            </svg>
          </span>

          <h3>Settings</h3>

          <div className="setting-item">
            <label>Dark Mode</label>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
          </div>

          <div className="setting-item">
            <label>Language</label>
            <select value={language} onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Notifications</label>
            <input type="checkbox" checked={notifications} onChange={toggleNotifications} />
          </div>

          <div className="setting-item">
            <label>Sound Effects</label>
            <input type="checkbox" checked={sound} onChange={toggleSound} />
          </div>

          <div className="setting-item">
            <label>Who can see your status?</label>
            <select value={privacy} onChange={handlePrivacyChange}>
              <option value="everyone">Everyone</option>
              <option value="friends">Friends</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
            />
          </div>

          <div className="setting-item">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
            {loading && <LoadingIcon />}  
            {error && <div className="error-message">{error}</div>}
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="profile-picture-preview"
              />
            ) : (
              <div className="placeholder">No profile picture selected</div>
            )}
          </div>

          <div className="settings-modal-footer">
            <button onClick={saveSettings}>Save</button>
            <button className="cancel-btn" onClick={resetSettings}>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
};

export default SettingsComponent;

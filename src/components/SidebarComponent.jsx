import React, { useContext, useState, useEffect, useRef } from 'react';
import './SidebarComponent.css';
import { ThemeContext } from '../App'; // Named import for ThemeContext
import 'normalize.css';


const SidebarComponent = ({ toggleSettings }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('home'); // Track active menu item
  const { theme, toggleTheme } = useContext(ThemeContext); // Access the current theme and toggleTheme
  
  const sidebarRef = useRef(null); // Ref to sidebar container

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle menu item click
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === 'settings') {
      toggleSettings(); // Open settings modal via App state
    }
  };

  // Close sidebar if clicking outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); // Close the sidebar if click is outside
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : 'closed'}`}
        onClick={toggleSidebar}
      >
        {isOpen ? '☰ Close' : '☰ Open'}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar ${isOpen ? 'visible' : 'hidden'} ${theme}`}
        ref={sidebarRef} // Attach the ref to the sidebar
      >
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeMenu === 'home' ? 'active' : ''}
            onClick={() => handleMenuClick('home')}
          >
            Home
          </li>
          <li
            className={activeMenu === 'chat' ? 'active' : ''}
            onClick={() => handleMenuClick('chat')}
          >
            Chat with Friends
          </li>
          <li
            className={activeMenu === 'history' ? 'active' : ''}
            onClick={() => handleMenuClick('history')}
          >
            Message History
          </li>
          <li
            className={activeMenu === 'settings' ? 'active' : ''}
            onClick={() => handleMenuClick('settings')}
          >
            Settings
          </li>
          <li
            className={activeMenu === 'help' ? 'active' : ''}
            onClick={() => handleMenuClick('help')}
          >
            Help
          </li>
        </ul>
        
        <div className="sidebar-footer">
          <button className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarComponent;

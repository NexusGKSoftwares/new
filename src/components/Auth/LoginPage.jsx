import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

function EnhancedLoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  // Handle window resize and set mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleGoogleSignIn = () => {
    navigate('/dashboard');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModeSwitch = () => {
    setIsAnimating(true);
    setIsSignUp(!isSignUp);
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className={styles['login-container']}>
      <div className={`${styles['login-card']} ${isMobile ? styles['mobile'] : ''}`}>
        {/* App Icon */}
        <img
          src="/assets/page3.png"
          alt="App Logo"
          className={`
            ${styles['app-icon']} 
            ${styles['floating']} 
            ${isSignUp ? styles['icon-slide-right'] : ''}
            ${isAnimating ? styles['animating'] : ''}
          `}
        />

        {/* Form Container */}
        <div 
          className={`
            ${styles['form-container']} 
            ${isSignUp ? styles['slide-right'] : ''}
            ${isAnimating ? styles['animating'] : ''}
          `}
        >
          <div className={styles['form-content']}>
            <h2 className={styles['form-title']}>
              {isSignUp ? 'Create Account' : 'Welcome Back!'}
            </h2>
            <p className={styles['form-subtitle']}>
              {isSignUp 
                ? 'Register with your details to use all site features' 
                : 'Sign in to access your account'}
            </p>

            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <div className={styles['form-group']}>
                  <input
                    type="text"
                    name="name"
                    className={styles['form-input']}
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className={styles['form-group']}>
                <input
                  type="email"
                  name="email"
                  className={styles['form-input']}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles['form-group']}>
                <input
                  type="password"
                  name="password"
                  className={styles['form-input']}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`${styles['submit-button']} ${isAnimating ? styles['animating'] : ''}`}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className={styles['social-signin']}>
              <div className={styles['divider']}>
                <span>Or continue with</span>
              </div>

              <button 
                onClick={handleGoogleSignIn} 
                className={styles['google-button']}
              >
                <img 
                  src="/assets/google.png" 
                  alt="Google Icon" 
                  className={styles['google-icon']} 
                />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>

        {/* Overlay Container */}
        <div 
          className={`
            ${styles['overlay-container']} 
            ${isSignUp ? styles['slide-left'] : ''}
            ${isAnimating ? styles['animating'] : ''}
          `}
        >
          <div className={styles['overlay-panel']}>
            <h3 className={styles['overlay-title']}>
              {isSignUp ? 'Already have an account?' : 'New here?'}
            </h3>
            <p className={styles['overlay-text']}>
              {isSignUp 
                ? 'Sign in to access your account' 
                : 'Sign up to discover all our features'}
            </p>
            <button
              className={styles['overlay-button']}
              onClick={handleModeSwitch}
              disabled={isAnimating}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedLoginPage;
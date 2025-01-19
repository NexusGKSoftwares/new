import React, { useState, useEffect, createContext, Suspense } from 'react';
import { Provider } from 'react-redux';
import CanvasBackground from './components/CanvasBackground';
import Sidebar from './components/SidebarComponent';
import Chat from './components/Chats';
import { store } from './app/store';
import axios from 'axios';
import './App.css';
import './index.css';
import ErrorMessage from './components/ErrorMessage';
import LoadingIcon from './components/LoadingIcon';
import 'normalize.css';

// Import the ErrorBoundary component
import ErrorBoundary from './components/ErrorBoundary';

const SettingsComponent = React.lazy(() => import('./components/SettingsComponent'));
const preloadSettingsComponent = () => {
  import('./components/SettingsComponent');
};

export const ThemeContext = createContext(null);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setPageLoaded(true);
    }, 5000);

    preloadSettingsComponent();

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      await preloadSettingsComponent();
      setIsSettingsLoaded(true);
    };
    loadSettings();
  }, []);

  const sendMessage = async (text) => {
    try {
      const response = await axios.post('http://localhost:5000/generate', {
        input_text: text,
      });
      setResponse(response.data.response);
    } catch (err) {
      setError('Error communicating with the backend. Please try again later.');
      console.error(err);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleReload = () => {
    setError(null);
    sendMessage(inputText);
  };

  const toggleSettings = () => {
    if (isSettingsLoaded) {
      setIsSettingsOpen((prevState) => !prevState);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (isLoading) {
    return <LoadingIcon />;
  }

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={`app-container ${theme}`}>
          <CanvasBackground />
          <Sidebar toggleSettings={toggleSettings} />
          <div className="main-content">
            <header className="flex justify-between items-center px-4 py-2">
              
            </header>

            {/* Wrap the Chat component with ErrorBoundary */}
            <ErrorBoundary>
              <Chat
                response={response}
                inputText={inputText}
                onInputChange={handleInputChange}
                onSendMessage={handleSendMessage}
              />
            </ErrorBoundary>

            {error && <ErrorMessage errorMessage={error} onReload={handleReload} />}

            {pageLoaded && (
              <Suspense fallback={<LoadingIcon />}>
                {isSettingsOpen && (
                  <SettingsComponent
                    isOpen={isSettingsOpen}
                    onClose={toggleSettings}
                  />
                )}
              </Suspense>
            )}
          </div>
        </div>
      </ThemeContext.Provider>
    </Provider>
  );
}

export default App;

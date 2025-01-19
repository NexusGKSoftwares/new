import React, { useState, useEffect, useContext, useRef } from 'react';
import './Chats.css';
import ErrorMessage from './ErrorMessage';
import { ThemeContext } from '../App';
import VoiceRecorder from './VoiceRecorder/VoiceRecorder';
import 'normalize.css';

const sendMessageToAI = async (inputText, audioFile = null, sessionId = 'default') => {
  try {
    let response;
    const formData = new FormData();

    if (audioFile) {
      // Create a proper audio file with correct MIME type
      const audioBlob = audioFile instanceof Blob ? audioFile : new Blob([audioFile], { type: 'audio/wav' });
      formData.append('audio', audioBlob, 'recording.wav');
    }
    
    formData.append('input_text', inputText || '');
    formData.append('session_id', sessionId);

    response = await fetch('http://127.0.0.1:5000/generate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Error: ${data.error}, Details: ${data.details || 'Unknown'}`);
    }

    return data.response;
  } catch (error) {
    console.error('Error communicating with MoyoAI:', error);
    throw new Error('Unable to get a response from the Moyoo. Please try again later okay? or reload!.');
  }
};

const Chat = () => {
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const [showError, setShowError] = useState(false);

  const MAX_MESSAGE_LENGTH = 500;
  const messagesEndRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setErrorMessage(value.length > MAX_MESSAGE_LENGTH ? 'Message is too long. Please reduce it.' : '');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Moyo AI is thinking...', {
            body: 'Your response is being generated with divine inspiration.',
            icon: 'my-app/public/favicon_io/favicon-16x16.png',
          });
        }
      });
    }
  };

  const handleRetry = async () => {
    if (lastFailedMessage) {
      setShowError(false);
      await processMessage(lastFailedMessage.content, lastFailedMessage.audioFile);
      setLastFailedMessage(null);
    }
  };

  const processMessage = async (messageText, audioFile = null) => {
    setIsTyping(true);
    showNotification();

    try {
      const aiResponse = await sendMessageToAI(messageText, audioFile);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'AI',
        content: `Moyo: ${aiResponse}`,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      return true;
    } catch (error) {
      setShowError(true);
      setLastFailedMessage({ content: messageText, audioFile });
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setShowError(false);
      }, 10000);
      return false;
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    if (input.length > MAX_MESSAGE_LENGTH) {
      setErrorMessage('Message is too long. Please reduce it.');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'USER',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    await processMessage(trimmedInput);
  };

  const handleAudioSendMessage = async ({ text, audio, duration }) => {
    if (!(audio instanceof Blob)) {
      console.error('Invalid audio file provided');
      return;
    }

    try {
      // Create a URL for the audio preview
      const audioUrl = URL.createObjectURL(audio);
      
      // Create and add the user's message with audio
      const userMessage = {
        id: Date.now(),
        type: 'USER_AUDIO',
        content: text || 'Voice message',
        audioUrl,
        duration,
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Process the message
      setIsTyping(true);
      showNotification();

      const aiResponse = await sendMessageToAI(text, audio);
      
      // Add AI's response
      const aiMessage = {
        id: Date.now() + 1,
        type: 'AI',
        content: `Moyo: ${aiResponse}`,
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending voice message:', error);
      setShowError(true);
      setLastFailedMessage({ content: text, audioFile: audio });
      
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setShowError(false);
      }, 10000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearClick = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    setShowModal(false);
    setLastFailedMessage(null);
    setShowError(false);
  };

  return (
    <div className={`chat-container ${theme}`}>
      <div className="chat-header">
        <h1 className="header-title" style={{ fontFamily: "'Raleway', sans-serif", fontStyle: 'italic', fontWeight: 400 }}>
          <span>Moyoo</span>
          <span>AI</span>
        </h1>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.type === 'USER' || message.type === 'USER_AUDIO' ? 'user' : 'bot'}`}
          >
            {message.type === 'USER_AUDIO' ? (
              <div className="voice-note">
                <audio controls src={message.audioUrl} />
              </div>
            ) : (
              message.content
            )}
          </div>
        ))}

        {isTyping && (
          <div className="message bot typing-indicator">
            <div className="typing-avatar">Moyo</div>
            <div className="typing-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        {showError && (
          <div className="error-notification">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <div className="error-message">
                <h4>Connection Lost</h4>
                <p>Unable to reach Moyo's consciousness. Click below to try again.</p>
              </div>
              <button className="retry-button" onClick={handleRetry}>
                Reload Chat
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this chat?</p>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={handleClearClick}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="chat-footer">
        <button
          className="clear-button"
          onClick={() => setShowModal(true)}
          aria-label="Delete chat"
        >
          <svg
            clipRule="evenodd"
            fillRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="delete-icon"
          >
            <path
              d="m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z"
              fillRule="nonzero"
            />
          </svg>
        </button>

        <div className="message-input">
          <textarea
            className="message-textarea"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows="1"
          />
        </div>

        <div className="voice-recorder">
          <VoiceRecorder
            onSendMessage={handleAudioSendMessage}
          />
        </div>

        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!input.trim() || input.length > MAX_MESSAGE_LENGTH}
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M23 0l-4.5 16.5-6.097-5.43 5.852-6.175-7.844 5.421-5.411-1.316 18-9zm-11 12.501v5.499l2.193-3.323-2.193-2.176zm-2.789 3.857l.94.934c-.875.885-1.773 1.933-2.125 3.375l-1.286-.314c.434-1.774 1.491-3.004 2.471-3.995zm-1.565 7.642c-.715 0-1.353-.279-1.887-.83-1.458.515-2.844-.044-3.576-1.084-.575-.817-.703-1.853-.353-2.845-.552-.534-.83-1.166-.83-1.884 0-1.562 1.16-2.803 3.24-2.586l.195 1.117c-.664.062-1.277.097-1.674.494-.668.668-.467 2.063.787 2.433-.832.836-.751 2.037-.127 2.696.654.69 1.903.799 2.765-.059.385 1.305 1.798 1.422 2.433.787.392-.392.431-.995.492-1.649l1.125.229c.2 1.979-1.009 3.181-2.59 3.181zm-3.318-7.032l.314 1.287c1.755-.43 2.953-1.45 3.989-2.471l-.938-.931c-.876.866-1.927 1.764-3.365 2.115z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;
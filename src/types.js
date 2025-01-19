// src/types.js

/**
 * Represents a single message in the chat.
 * @typedef {Object} Message
 * @property {number} id - Unique identifier for the message.
 * @property {string} type - Type of the message ('USER', 'AI', or 'SYSTEM').
 * @property {string} content - Content of the message.
 * @property {Date} timestamp - Timestamp of when the message was created.
 */

/**
 * Enum for message types.
 * @type {{USER: string, AI: string, SYSTEM: string}}
 */
const MessageType = {
    USER: 'USER',
    AI: 'AI',
    SYSTEM: 'SYSTEM',
  };
  
  /**
   * Context for the conversation session.
   * @typedef {Object} ConversationContext
   * @property {string} sessionId - Unique identifier for the session.
   * @property {string} language - Language of the conversation (e.g., 'en').
   * @property {string} theme - Theme of the conversation (e.g., 'default').
   */
  
  export { MessageType };
  
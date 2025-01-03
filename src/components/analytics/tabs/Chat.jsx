import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { useAccount } from 'wagmi';
import { shortenAddress } from '../../../utils/format';
import { FaSmile, FaPaperPlane, FaCrown } from 'react-icons/fa';
import { sendMessage, subscribeToMessages } from '../../../utils/firebase';
import { ethers } from 'ethers';
import { NFTCollectionABI } from '../../../abi/NFTCollection';
import MessageAvatar from '../../../components/avatars/MessageAvatar';
import { IoColorPaletteOutline } from "react-icons/io5";

const CHAT_THEMES = {
  dark: {
    bg: 'bg-[#1a1b1f]',
    header: 'bg-gray-800',
    messageBubble: {
      sent: 'bg-[#00ffbd] text-gray-900',
      received: 'bg-gray-700 text-white'
    },
    input: {
      bg: 'bg-gray-700',
      text: 'text-white',
      placeholder: 'text-gray-400'
    },
    address: {
      bg: 'bg-gray-800/50',
      text: 'text-[#00ffbd]'
    },
    time: 'text-gray-500'
  },
  light: {
    bg: 'bg-gray-100',
    header: 'bg-white',
    messageBubble: {
      sent: 'bg-[#00ffbd] text-gray-900',
      received: 'bg-white text-gray-900 border border-gray-200'
    },
    input: {
      bg: 'bg-gray-100',
      text: 'text-gray-900',
      placeholder: 'text-gray-500'
    },
    address: {
      bg: 'bg-gray-200/50',
      text: 'text-gray-700'
    },
    time: 'text-gray-500'
  },
  midnight: {
    bg: 'bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900',
    header: 'bg-black/40',
    messageBubble: {
      sent: 'bg-blue-500 text-white',
      received: 'bg-gray-700/90 text-white'
    },
    input: {
      bg: 'bg-gray-800/60',
      text: 'text-blue-100',
      placeholder: 'text-gray-400'
    },
    address: {
      bg: 'bg-blue-900/30',
      text: 'text-blue-400'
    },
    time: 'text-blue-300/70'
  },
  sunset: {
    bg: 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500',
    header: 'bg-black/40',
    messageBubble: {
      sent: 'bg-yellow-400 text-gray-900',
      received: 'bg-white/90 text-gray-900'
    },
    input: {
      bg: 'bg-red-900/30',
      text: 'text-white',
      placeholder: 'text-gray-300'
    },
    address: {
      bg: 'bg-orange-900/30',
      text: 'text-orange-200'
    },
    time: 'text-orange-200/70'
  },
  forest: {
    bg: 'bg-gradient-to-br from-green-700 via-green-800 to-green-900',
    header: 'bg-black/40',
    messageBubble: {
      sent: 'bg-green-400 text-gray-900',
      received: 'bg-gray-200 text-gray-900'
    },
    input: {
      bg: 'bg-green-900/30',
      text: 'text-green-100',
      placeholder: 'text-gray-400'
    },
    address: {
      bg: 'bg-green-900/30',
      text: 'text-green-400'
    },
    time: 'text-green-300/70'
  },
  sepia: {
    bg: 'bg-gradient-to-br from-[#704214] via-[#8B5E34] to-[#A0522D]',
    header: 'bg-[#3E1F0A]/60',
    messageBubble: {
      sent: 'bg-[#DEB887] text-[#3E1F0A]',
      received: 'bg-[#F5DEB3] text-[#3E1F0A]'
    },
    input: {
      bg: 'bg-[#3E1F0A]/30',
      text: 'text-[#DEB887]',
      placeholder: 'text-[#DEB887]/60'
    },
    address: {
      bg: 'bg-[#3E1F0A]/40',
      text: 'text-[#DEB887]'
    },
    time: 'text-[#DEB887]/70'
  },
  ocean: {
    bg: 'bg-gradient-to-br from-cyan-600 via-blue-700 to-blue-900',
    header: 'bg-black/40',
    messageBubble: {
      sent: 'bg-cyan-400 text-gray-900',
      received: 'bg-white/90 text-gray-900'
    },
    input: {
      bg: 'bg-blue-900/30',
      text: 'text-cyan-100',
      placeholder: 'text-gray-400'
    },
    address: {
      bg: 'bg-cyan-900/30',
      text: 'text-cyan-400'
    },
    time: 'text-cyan-200/70'
  },
  cosmic: {
    bg: 'bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900',
    header: 'bg-black/40',
    messageBubble: {
      sent: 'bg-violet-400 text-gray-900',
      received: 'bg-indigo-200 text-gray-900'
    },
    input: {
      bg: 'bg-purple-900/30',
      text: 'text-violet-100',
      placeholder: 'text-gray-400'
    },
    address: {
      bg: 'bg-violet-900/30',
      text: 'text-violet-400'
    },
    time: 'text-violet-200/70'
  },
  matrix: {
    bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
    header: 'bg-black/40',
    messageBubble: {
      sent: 'bg-[#00ff00] text-gray-900',
      received: 'bg-gray-800 text-[#00ff00] border border-[#00ff00]/30'
    },
    input: {
      bg: 'bg-gray-900',
      text: 'text-[#00ff00]',
      placeholder: 'text-[#00ff00]/60'
    },
    address: {
      bg: 'bg-gray-900/50',
      text: 'text-[#00ff00]'
    },
    time: 'text-[#00ff00]/70'
  }
};

const Chat = ({ collection }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Subscribe to messages
  useEffect(() => {
    if (!collection?.contractAddress) return;
    
    const unsubscribe = subscribeToMessages(collection.contractAddress, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [collection?.contractAddress]);

  // Auto scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const messageText = newMessage.trim();
    if (messageText.length > 500) return; // Message length limit

    setIsLoading(true);
    try {
      const success = await sendMessage({
        text: messageText,
        sender: address,
        collectionAddress: collection.contractAddress
      });

      if (success) {
        setNewMessage('');
        setShowEmojiPicker(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    if (newMessage.length + 2 <= 500) { // Check length including emoji
      setNewMessage(prev => prev + emojiObject.emoji);
    }
  };

  // Inside the Chat component, add a function to format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !(timestamp instanceof Date)) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  // Add auto-resize function
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'; // Max height of 150px
    }
  };

  // Add this helper function
  const isCreator = (messageSender) => {
    if (!collection?.creator && !collection?.creatorAddress) {
      console.error('No creator address found in collection:', collection);
      return false;
    }
    
    const creatorAddress = (collection.creator || collection.creatorAddress)?.toLowerCase();
    const senderAddress = messageSender?.toLowerCase();
    
    console.log('Creator Check:', {
      creatorAddress,
      senderAddress,
      isMatch: creatorAddress === senderAddress
    });
    
    return creatorAddress === senderAddress;
  };

  // First, add a helper function to group messages
  const groupMessages = (messages) => {
    return messages.reduce((groups, message, index) => {
      const prevMessage = messages[index - 1];
      const isSameSender = prevMessage && prevMessage.sender.toLowerCase() === message.sender.toLowerCase();
      const isWithinTimeWindow = prevMessage && 
        (message.timestamp - prevMessage.timestamp) / (1000 * 60) < 5; // 5 minutes window

      if (isSameSender && isWithinTimeWindow) {
        // Add to last group
        const lastGroup = groups[groups.length - 1];
        lastGroup.messages.push(message);
        return groups;
      } else {
        // Create new group
        groups.push({
          id: message.id,
          sender: message.sender,
          messages: [message]
        });
        return groups;
      }
    }, []);
  };

  // Update the ThemeSelector component
  const ThemeSelector = () => (
    <div className="relative group z-20">
      <button
        className="p-1.5 rounded-lg bg-gray-700/80 hover:bg-gray-600 transition-colors flex items-center gap-2"
        title="Select Theme"
      >
        <IoColorPaletteOutline className="w-4 h-4 text-[#00ffbd]" />
        <span className="text-xs text-gray-300">Theme</span>
      </button>
      
      {/* Theme Selector Dropdown */}
      <div className="absolute right-0 top-[120%] mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl p-3 border border-gray-700 min-w-[180px]">
          <div className="text-xs text-gray-400 mb-2">Select Theme</div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CHAT_THEMES).map(([themeName, theme]) => (
              <button
                key={themeName}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentTheme(themeName);
                }}
                className={`
                  w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110
                  ${currentTheme === themeName 
                    ? 'border-[#00ffbd] scale-110 shadow-lg shadow-[#00ffbd]/20' 
                    : 'border-transparent hover:border-gray-500'
                  }
                  ${theme.bg}
                `}
                title={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Add a helper function to get theme safely
  const getTheme = (themeName) => {
    return CHAT_THEMES[themeName] || CHAT_THEMES['dark'];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full h-full rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${getTheme(currentTheme).bg}`}
    >
      {/* Chat Header */}
      <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${getTheme(currentTheme).header}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Collection Chat</h3>
        <div className="flex items-center justify-between py-1">
          <p className="text-sm font-bold text-gray-300">
            Join the conversation
          </p>
          <ThemeSelector />
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="h-[calc(100%-9.5rem)] overflow-y-auto overflow-x-hidden p-4 space-y-4 
          custom-scrollbar"
      >
        <AnimatePresence>
          {groupMessages(messages).map((group) => {
            const isMyMessage = group.sender.toLowerCase() === address?.toLowerCase();
            const isCreatorMessage = isCreator(group.sender);
            
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, x: isMyMessage ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`flex w-full ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex gap-2 max-w-[60%]">
                  <div className={`
                    flex-shrink-0 self-start mt-1
                    ${isMyMessage ? 'order-2' : ''}
                  `}>
                    <div className="relative">
                      <MessageAvatar address={group.sender} size={32} />
                      {isCreatorMessage && (
                        <div className="group relative">
                          <FaCrown 
                            className="absolute -top-2 -right-2 text-yellow-400 w-4 h-4 cursor-help" 
                          />
                          {/* Updated Tooltip */}
                          <span className="absolute -top-6 right-0 
                            scale-0 transition-all group-hover:scale-100
                            px-2 py-1 text-xs rounded bg-gray-800 text-yellow-400 whitespace-nowrap z-10"
                          >
                            Creator
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow gap-1">
                    {group.messages.map((message, index) => (
                      <div key={message.id} className="flex flex-col">
                        {/* Message Bubble */}
                        <div className={`
                          p-3 
                          min-w-[60px]
                          break-words whitespace-pre-wrap
                          ${isMyMessage 
                            ? getTheme(currentTheme).messageBubble.sent
                            : getTheme(currentTheme).messageBubble.received
                          }
                          ${index === 0 ? 'rounded-t-2xl' : ''}
                          ${index === group.messages.length - 1 ? 
                            (isMyMessage ? 'rounded-l-2xl rounded-br-sm' : 'rounded-r-2xl rounded-bl-sm')
                            : ''
                          }
                        `}>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))}

                    {/* Single Timestamp and Address for the group */}
                    <div className={`
                      flex items-center mt-1 gap-2 text-xs
                      ${isMyMessage ? 'justify-end' : 'justify-start'}
                    `}>
                      <div className="flex items-center gap-1">
                        {!isCreatorMessage && (
                          <span className={`
                            px-2 py-0.5 rounded-full
                            ${getTheme(currentTheme).address.bg}
                            ${getTheme(currentTheme).address.text}
                          `}>
                            {shortenAddress(group.sender)}
                          </span>
                        )}
                      </div>
                      <span className={getTheme(currentTheme).time}>
                        {formatTimestamp(group.messages[group.messages.length - 1].timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className={`relative p-4 border-t border-gray-200 dark:border-gray-700 ${getTheme(currentTheme).header}`}>
        <div className="relative flex items-start">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-400 hover:text-[#00ffbd] transition-colors self-start mt-1"
              disabled={isLoading}
            >
              <FaSmile className="w-5 h-5" />
            </button>

            {/* Emoji Picker with better positioning */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 bottom-full mb-2"
                >
                  <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      theme="dark"
                      width={320}
                      height={400}
                      lazyLoadEmojis={true}
                      searchPlaceHolder="Search emoji..."
                      previewConfig={{
                        showPreview: false
                      }}
                      skinTonesDisabled
                      categories={['smileys_people', 'animals_nature', 'food_drink', 'travel_places', 'activities', 'objects', 'symbols', 'flags']}
                      style={{
                        '--epr-bg-color': '#1a1b1f',
                        '--epr-category-label-bg-color': '#2d2e35',
                        '--epr-hover-bg-color': '#2d2e35',
                        '--epr-search-border-color': '#2d2e35',
                        '--epr-border-radius': '0.5rem',
                        '--epr-category-label-text-color': '#ffffff80',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <textarea
            ref={textareaRef}
            rows="1"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value.slice(0, 500));
              autoResize();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={isLoading ? "Sending..." : "Type a message..."}
            className={`
              flex-1 rounded-lg px-4 py-2 ml-2 
              focus:outline-none focus:ring-2 focus:ring-[#00ffbd] 
              resize-none overflow-hidden min-h-[40px] max-h-[150px]
              custom-scrollbar
              ${getTheme(currentTheme).input.bg}
              ${getTheme(currentTheme).input.text}
              placeholder:${getTheme(currentTheme).input.placeholder}
            `}
            disabled={isLoading}
          />
          
          <button
            type="submit"
            className="p-2 ml-2 text-gray-400 hover:text-[#00ffbd] transition-colors 
              disabled:opacity-50 disabled:cursor-not-allowed self-start mt-1"
            disabled={!newMessage.trim() || isLoading}
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </div>

        {/* Message length indicator */}
        <div className="mt-1 text-xs text-right text-gray-500">
          {newMessage.length}/500
        </div>
      </form>
    </motion.div>
  );
};

export default Chat; 
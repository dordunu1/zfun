import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import { useAccount } from 'wagmi';
import { shortenAddress } from '../../../utils/format';
import { FaSmile, FaPaperPlane, FaCrown, FaTrash, FaBan } from 'react-icons/fa';
import { sendMessage, subscribeToMessages, updateBannedUsers, deleteMessage, loadBannedUsers } from '../../../utils/firebase';
import { ethers } from 'ethers';
import { NFTCollectionABI } from '../../../abi/NFTCollection';
import MessageAvatar from '../../../components/avatars/MessageAvatar';
import { IoColorPaletteOutline } from "react-icons/io5";
import { XMarkIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import DOMPurify from 'dompurify';

const CHAT_THEMES = {
  dark: {
    bg: 'bg-[#1a1b1f]',
    header: 'bg-gray-800',
    messageBubble: {
      sent: 'bg-[#00ffbd] text-gray-900',
      received: 'bg-gray-700/90 text-white'
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
    time: 'text-gray-500',
    link: 'text-[#00ffbd]',
    linkPreview: 'bg-black/20'
  },
  light: {
    bg: 'bg-gray-100',
    header: 'bg-white',
    messageBubble: {
      sent: 'bg-[#00ffbd] text-gray-900',
      received: 'bg-gray-200 text-gray-900'
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
      sent: 'bg-blue-500/90 text-white',
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
    time: 'text-orange-200/70',
    link: 'text-yellow-400',
    linkPreview: 'bg-black/20'
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

// Add new ReplyPreview component
const ReplyPreview = ({ replyTo, onClose }) => (
  <div className="flex items-center gap-2 bg-black/20 rounded-lg mb-2 overflow-hidden">
    <div className="w-1 h-full bg-[#00ffbd] self-stretch" />
    <div className="flex-1 min-w-0 px-3 py-2">
      <div className="flex items-center gap-2 text-xs mb-0.5">
        <ArrowUturnLeftIcon className="w-3 h-3 text-[#00ffbd]" />
        <span className="font-medium text-[#00ffbd]">
          Replying to {shortenAddress(replyTo.sender)}
        </span>
      </div>
      <div className="text-sm text-gray-400 truncate max-w-[300px]">
        {replyTo.text}
      </div>
    </div>
    <button 
      onClick={onClose}
      className="p-2 hover:bg-black/20 transition-colors"
    >
      <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-300" />
    </button>
  </div>
);

// Add a new MessageBubble component
const MessageBubble = ({ message, isMyMessage, isCreatorMessage, onReply, currentTheme, getTheme, isCreator, handleModeration, address }) => {
  const canReply = !message.threadDepth || message.threadDepth < 3;
  
  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-message');
      setTimeout(() => element.classList.remove('highlight-message'), 2000);
    }
  };
  
  // Extract URLs from message
  const urls = message.text.match(/(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g) || [];
  
  return (
    <div className="relative group" id={`message-${message.id}`}>
      {message.replyTo && (
        <button 
          onClick={() => scrollToMessage(message.replyTo.messageId)}
          className="flex items-center mb-1 max-w-[256px] bg-black/20 rounded-lg 
            hover:bg-black/30 transition-colors overflow-hidden cursor-pointer"
        >
          <div className="w-1 h-full bg-[#00ffbd] self-stretch" />
          <div className="px-3 py-1.5 text-left">
            <div className="flex items-center gap-1 text-xs">
              <ArrowUturnLeftIcon className="w-3 h-3 text-[#00ffbd]" />
              <span className="font-medium text-[#00ffbd]">
                {shortenAddress(message.replyTo.sender)}
              </span>
            </div>
            <div className="text-xs text-gray-400 truncate">
              {message.replyTo.text}
            </div>
          </div>
        </button>
      )}
      
      <div className={`
        flex
        ${isMyMessage ? 'justify-end' : 'justify-start'}
        min-w-[60px] max-w-[85%]
      `}>
        <div className={`
          relative group flex flex-col
          ${isMyMessage ? 'items-end' : 'items-start'}
        `}>
          <div className="flex items-center gap-2">
            <div className={`
              px-4 py-2 rounded-2xl break-words relative
              ${isMyMessage ? 'rounded-tr-sm' : 'rounded-tl-sm'}
              ${isCreatorMessage 
                ? '!bg-gradient-to-r from-yellow-500 to-yellow-600 !text-white' 
                : isMyMessage 
                  ? getTheme(currentTheme).messageBubble.sent
                  : getTheme(currentTheme).messageBubble.received
              }
            `}>
              <div className="whitespace-pre-wrap inline-block">
                {formatMessageWithLinks(message.text)}
              </div>
              
              {/* Link Previews */}
              {urls.map((url, index) => (
                <LinkPreview 
                  key={index} 
                  url={url} 
                  currentTheme={currentTheme}
                  getTheme={getTheme}
                />
              ))}
            </div>

            <div className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
              flex items-center gap-2 transition-opacity">
              {canReply && (
                <button
                  onClick={() => onReply(message)}
                  className="p-1 rounded-full hover:bg-gray-700/50 transition-all"
                  title="Reply"
                >
                  <ArrowUturnLeftIcon className="w-3.5 h-3.5 text-[#00ffbd]" />
                </button>
              )}

              {/* Show delete button for creator's own messages OR when moderating others' messages */}
              {isCreator(address) && (isMyMessage || !isMyMessage) && (
                <button
                  onClick={() => handleModeration('delete', message.sender, message.id)}
                  className="p-1 rounded hover:bg-red-500/10 text-red-400"
                  title="Delete Message"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Only show ban button for other users' messages */}
              {isCreator(address) && !isMyMessage && (
                <button
                  onClick={() => handleModeration('ban', message.sender)}
                  className="p-1 rounded hover:bg-red-500/10 text-red-400"
                  title="Ban User"
                >
                  <FaBan className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thread messages - moved inside the message loop */}
      {message.threadId && !message.replyTo && (
        <div className="pl-4 border-l-2 border-gray-700 mt-2">
          {messages
            .filter(m => m.threadId === message.threadId && m.id !== message.id)
            .map(threadMessage => (
              <MessageBubble
                key={threadMessage.id}
                message={threadMessage}
                isMyMessage={threadMessage.sender.toLowerCase() === address?.toLowerCase()}
                isCreatorMessage={isCreator(threadMessage.sender)}
                onReply={handleReply}
                currentTheme={currentTheme}
                getTheme={getTheme}
                isCreator={isCreator}
                handleModeration={handleModeration}
                address={address}
              />
            ))}
        </div>
      )}
    </div>
  );
};

// Add BanList modal
const BanList = ({ show, onClose, bannedAddresses, onUnban }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1b1f] rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Banned Users</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          {bannedAddresses.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No banned users</p>
          ) : (
            bannedAddresses.map(address => (
              <div key={address} className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-gray-300">{shortenAddress(address)}</span>
                <button
                  onClick={() => onUnban(address)}
                  className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition-colors"
                >
                  Unban
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Add this utility function to format message text with clickable links
const formatMessageWithLinks = (text) => {
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  
  // Sanitize the text first
  const sanitizedText = DOMPurify.sanitize(text);
  
  // Replace URLs with clickable links
  return sanitizedText.split(urlPattern).map((part, i) => {
    if (part.match(urlPattern)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ffbd] hover:underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Update the LinkPreview component
const LinkPreview = ({ url, currentTheme, getTheme }) => {
  try {
    const urlObj = new URL(url);
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname);
    const isTwitter = urlObj.hostname === 'twitter.com' || urlObj.hostname === 'x.com';
    const theme = getTheme(currentTheme);

    if (isTwitter) {
      // Extract tweet ID from URL
      const tweetId = url.split('/').pop().split('?')[0];
      return (
        <div className={`mt-2 rounded-lg overflow-hidden ${theme.linkPreview}`}>
          <div className="custom-twitter-embed">
            <iframe
              src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=dark&cards=hidden`}
              className="w-full min-h-[300px] border-0"
              allowFullScreen
            />
          </div>
        </div>
      );
    }

    if (isImage) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block mt-2 rounded-lg overflow-hidden ${theme.linkPreview} hover:bg-black/30 transition-colors`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full pt-[56.25%]">
            <img
              src={url}
              alt="Preview"
              className="absolute top-0 left-0 w-full h-full object-contain bg-black/40"
              onError={(e) => e.target.parentElement.parentElement.style.display = 'none'}
            />
          </div>
          <div className="flex items-center gap-2 p-2 border-t border-white/10">
            <img
              src={`https://www.google.com/s2/favicons?domain=${urlObj.hostname}`}
              alt=""
              className="w-4 h-4"
            />
            <span className={`text-sm ${theme.link}`} truncate>
              {urlObj.hostname}
            </span>
          </div>
        </a>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block mt-2 rounded-lg overflow-hidden ${theme.linkPreview} hover:bg-black/30 transition-colors`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 p-2">
          <img
            src={`https://www.google.com/s2/favicons?domain=${urlObj.hostname}`}
            alt=""
            className="w-4 h-4"
          />
          <span className={`text-sm ${theme.link}`} truncate>
            {urlObj.hostname}
          </span>
        </div>
      </a>
    );
  } catch (error) {
    return null;
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
  const [replyingTo, setReplyingTo] = useState(null);
  const emojiPickerRef = useRef(null);
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [bannedAddresses, setBannedAddresses] = useState([]);
  const [showBanList, setShowBanList] = useState(false);

  // Memoize the creator address
  const creatorAddress = React.useMemo(() => {
    if (!collection?.creator && !collection?.creatorAddress) {
      return null;
    }
    return (collection.creator || collection.creatorAddress)?.toLowerCase();
  }, [collection?.creator, collection?.creatorAddress]);

  // Move isCreator check to a memoized function
  const isCreator = React.useCallback((messageSender) => {
    if (!creatorAddress || !messageSender) return false;
    return creatorAddress === messageSender.toLowerCase();
  }, [creatorAddress]);

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

  // Add reply handler
  const handleReply = (message) => {
    setReplyingTo({
      messageId: message.id,
      text: message.text,
      sender: message.sender,
      threadId: message.threadId || message.id,
      threadDepth: message.threadDepth || 0
    });
    textareaRef.current?.focus();
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading || !isChatEnabled) return;

    // Check if user is banned (case-insensitive check)
    if (bannedAddresses.some(addr => addr.toLowerCase() === address?.toLowerCase())) {
      toast.error("You have been banned from this chat");
      return;
    }

    setIsLoading(true);
    try {
      await sendMessage({
        text: newMessage,
        sender: address,
        collectionAddress: collection.contractAddress,
        replyTo: replyingTo
      });
        setNewMessage('');
      setReplyingTo(null);
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
    setIsLoading(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
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

  // Add this useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add moderation controls for creator
  const ModeratorControls = ({ isCreator }) => {
    if (!isCreator) return null;
    
    return (
      <div className="flex items-center gap-2 px-4">
        <div className="h-4 border-l border-gray-300 dark:border-gray-700" />
        
        {/* Ban List Button */}
        <button
          onClick={() => setShowBanList(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
            transition-colors group relative"
          title="Manage Banned Users"
        >
          <FaBan className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
          {bannedAddresses.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 
              rounded-full text-[10px] text-white flex items-center justify-center">
              {bannedAddresses.length}
            </span>
          )}
        </button>
      </div>
    );
  };

  // Add moderation functions
  const handleModeration = async (action, userAddress, messageId = null) => {
    try {
      switch (action) {
        case 'ban':
          const newBannedList = [...bannedAddresses, userAddress.toLowerCase()];
          await updateBannedUsers(collection.contractAddress, newBannedList);
          // No need to setBannedAddresses here as the subscription will handle it
          toast.success(`User ${shortenAddress(userAddress)} banned successfully`);
          break;
        
        case 'delete':
          if (messageId) {
            await deleteMessage(collection.contractAddress, messageId);
            toast.success('Message deleted');
          }
          break;
      }
    } catch (error) {
      console.error('Error in moderation:', error);
      toast.error('Failed to perform moderation action');
    }
  };

  // Add a subscription to banned users list
  useEffect(() => {
    if (collection?.contractAddress) {
      // Initial load of banned users
      const loadBannedList = async () => {
        try {
          const bannedList = await loadBannedUsers(collection.contractAddress);
          setBannedAddresses(bannedList);
        } catch (error) {
          console.error('Error loading banned users:', error);
        }
      };
      
      loadBannedList();

      // Subscribe to banned users changes
      const unsubscribe = onSnapshot(
        doc(db, 'collections', collection.contractAddress, 'moderation', 'bannedUsers'),
        (doc) => {
          if (doc.exists()) {
            setBannedAddresses(doc.data().addresses || []);
          } else {
            setBannedAddresses([]);
          }
        }
      );

      return () => unsubscribe();
    }
  }, [collection?.contractAddress]);

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
          <div className="flex items-center gap-3">
            {/* Add Moderation Controls for Creator */}
            {isCreator(address) && (
              <div className="flex items-center gap-2">
                {/* Remove chat toggle button, keep only ban list */}
                <button
                  onClick={() => setShowBanList(true)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors relative"
                  title="Manage Banned Users"
                >
                  <FaBan className="w-5 h-5 text-gray-400 hover:text-red-400" />
                  {bannedAddresses.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 
                      rounded-full text-[10px] text-white flex items-center justify-center">
                      {bannedAddresses.length}
                    </span>
                  )}
                </button>
              </div>
            )}
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="h-[calc(100%-10rem)] overflow-y-auto overflow-x-hidden p-4 space-y-4 
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
                        <div className="group absolute -top-1 -left-1">
                          <FaCrown 
                            className="text-yellow-400 w-4 h-4 cursor-help" 
                          />
                          <span className="absolute -top-6 left-0 
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
                        <MessageBubble
                          message={message}
                          isMyMessage={isMyMessage}
                          isCreatorMessage={isCreatorMessage}
                          onReply={handleReply}
                          currentTheme={currentTheme}
                          getTheme={getTheme}
                          isCreator={isCreator}
                          handleModeration={handleModeration}
                          address={address}
                        />

                        {/* Thread messages - moved inside the message loop */}
                        {message.threadId && !message.replyTo && (
                          <div className="pl-4 border-l-2 border-gray-700 mt-2">
                            {messages
                              .filter(m => m.threadId === message.threadId && m.id !== message.id)
                              .map(threadMessage => (
                                <MessageBubble
                                  key={threadMessage.id}
                                  message={threadMessage}
                                  isMyMessage={threadMessage.sender.toLowerCase() === address?.toLowerCase()}
                                  isCreatorMessage={isCreator(threadMessage.sender)}
                                  onReply={handleReply}
                                  currentTheme={currentTheme}
                                  getTheme={getTheme}
                                  isCreator={isCreator}
                                  handleModeration={handleModeration}
                                  address={address}
                                />
                              ))}
                          </div>
                        )}
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
      <form 
        onSubmit={handleSubmit} 
        className={`
          sticky bottom-0
          relative p-4 border-t border-gray-200 dark:border-gray-700 
          ${getTheme(currentTheme).header}
          ${replyingTo ? 'pt-2 pb-3' : 'py-4'}
          transition-all duration-200
          bg-inherit
        `}
      >
        {replyingTo && (
          <ReplyPreview 
            replyTo={replyingTo} 
            onClose={() => setReplyingTo(null)} 
          />
        )}
        
        <div className="relative flex items-start">
          <div ref={emojiPickerRef} className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`
                p-2 transition-colors self-start
                ${getTheme(currentTheme).input.text} 
                hover:text-[#00ffbd]
              `}
              disabled={isLoading}
          >
            <FaSmile className="w-5 h-5" />
          </button>
          
            {/* Update Emoji Picker positioning */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-0"
                >
                  <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <div 
                      className="relative"
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme="dark"
                        width={280}
                        height={350}
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
                          '--epr-scrollbar-width': '8px',
                          '--epr-scrollbar-track-color': 'transparent',
                          '--epr-scrollbar-thumb-color': 'rgba(255, 255, 255, 0.2)',
                          '--epr-scrollbar-thumb-hover-color': 'rgba(255, 255, 255, 0.3)',
                        }}
                      />
                    </div>
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
            autoFocus
            onFocus={(e) => e.target.select()}
            placeholder={isLoading ? "Sending..." : "Type a message..."}
            className={`
              flex-1 rounded-lg px-4 py-2 ml-2 
              focus:outline-none focus:ring-2 focus:ring-[#00ffbd] 
              resize-none overflow-hidden min-h-[40px] max-h-[150px]
              custom-scrollbar transition-all duration-200
              ${getTheme(currentTheme).input.bg}
              ${getTheme(currentTheme).input.text}
              placeholder:${getTheme(currentTheme).input.placeholder}
            `}
            disabled={isLoading}
          />
          
          <button
            type="submit"
            className={`
              p-2 ml-2 transition-colors self-start mt-1
              ${getTheme(currentTheme).input.text}
              hover:text-[#00ffbd]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={!newMessage.trim() || isLoading}
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </div>

        <div className={`
          mt-1 text-xs text-right
          ${getTheme(currentTheme).time}
        `}>
            {newMessage.length}/500
          </div>
      </form>

      {/* Add BanList Modal */}
      <BanList 
        show={showBanList}
        onClose={() => setShowBanList(false)}
        bannedAddresses={bannedAddresses}
        onUnban={async (address) => {
          try {
            const newBannedList = bannedAddresses.filter(a => a !== address);
            await updateBannedUsers(collection.contractAddress, newBannedList);
            setBannedAddresses(newBannedList);
            toast.success('User unbanned successfully');
          } catch (error) {
            console.error('Error unbanning user:', error);
            toast.error('Failed to unban user');
          }
        }}
      />
    </motion.div>
  );
};

export default Chat; 
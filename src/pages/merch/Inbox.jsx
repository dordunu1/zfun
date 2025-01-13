import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, writeBatch, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { BiSend, BiArrowBack, BiMessageDetail, BiCheck, BiCheckDouble, BiPencil, BiTrash, BiX } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import VerificationCheckmark from '../../components/shared/VerificationCheckmark';

const LoadingSkeleton = () => (
  <div className="grid grid-cols-12">
    <div className="col-span-4 border-r">
      <div className="p-4 border-b">
        <motion.div 
          className="h-7 w-32 bg-gray-200 rounded"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <div className="overflow-y-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b">
            <div className="flex items-center gap-1.5 mb-2">
              <motion.div 
                className="h-5 w-32 bg-gray-200 rounded"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
              <motion.div 
                className="h-3 w-3 bg-gray-200 rounded-full"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            </div>
            <motion.div 
              className="h-4 w-48 bg-gray-200 rounded"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>
    </div>
    <div className="col-span-8">
      <div className="p-4 border-b">
        <motion.div 
          className="h-6 w-32 bg-gray-200 rounded"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <div className="p-4 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <motion.div 
              className={`rounded-lg h-10 ${i % 2 === 0 ? 'bg-pink-100 w-64' : 'bg-gray-200 w-48'}`}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          </div>
        ))}
        {/* Product Card Skeleton */}
        <div className="flex justify-start">
          <motion.div 
            className="w-[280px] h-[300px] bg-gray-200 rounded-xl"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>
      <div className="p-4 border-t mt-auto">
        <motion.div 
          className="h-10 bg-gray-200 rounded-lg"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </div>
  </div>
);

const MessageStatus = ({ message, currentUser }) => {
  if (message.senderId !== currentUser.uid) return null;
  
  const getTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="flex items-center gap-1 text-xs mt-1">
      <span className="text-gray-400">{getTime(message.timestamp)}</span>
      <div className="text-gray-400">
        {!message.delivered && <BiCheck className="text-sm" />}
        {message.delivered && !message.read && <BiCheckDouble className="text-sm" />}
        {message.delivered && message.read && <BiCheckDouble className="text-sm text-[#FF1B6B]" />}
      </div>
    </div>
  );
};

const Message = ({ message, currentUser, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
  const isOwnMessage = message.senderId === currentUser.uid;
  const navigate = useNavigate();

  const renderProductCard = (productCard) => (
    <div className={`my-4 ${isOwnMessage ? 'ml-auto' : ''} max-w-[280px]`}>
      <button 
        onClick={() => navigate(`/merch-store/product/${productCard.productId}`)}
        className={`w-full rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow ${
          isOwnMessage ? 'border-pink-100' : 'border-gray-100'
        }`}
      >
        <img 
          src={productCard.image} 
          alt={productCard.name} 
          className="w-full h-48 object-cover"
        />
        <div className="p-3 bg-white text-left">
          <h4 className="font-medium text-gray-800">
            {productCard.name}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {productCard.description}
          </p>
          <p className="font-medium mt-2 text-[#FF1B6B]">
            ${productCard.price.toFixed(2)}
          </p>
        </div>
      </button>
    </div>
  );

  const handleEdit = () => {
    onEdit(message.id, editedText);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedText(message.text);
    }
  };

  return (
    <div className={`mb-6 ${isOwnMessage ? 'text-right' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="inline-block relative group">
          {isEditing ? (
            <div className="flex flex-col gap-2 min-w-[300px]">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF1B6B] focus:ring-1 focus:ring-[#FF1B6B] min-h-[100px] resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1.5 text-[#FF1B6B] hover:bg-pink-50 rounded-full transition-colors flex items-center gap-1"
                >
                  <BiCheck className="text-xl" />
                  <span className="text-sm">Save</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedText(message.text);
                  }}
                  className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1"
                >
                  <BiX className="text-xl" />
                  <span className="text-sm">Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`inline-block max-w-[80%] relative ${isOwnMessage ? 'ml-auto' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {isOwnMessage && !message.productCard && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 text-gray-500 hover:text-[#FF1B6B] hover:bg-pink-50 rounded-full transition-colors"
                      >
                        <BiPencil className="text-sm" />
                      </button>
                      <button
                        onClick={() => onDelete(message.id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <BiTrash className="text-sm" />
                      </button>
                    </div>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 ${
                        isOwnMessage
                          ? 'bg-[#FF1B6B] text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-left">
                        {message.text}
                      </p>
                    </div>
                    {message.edited && (
                      <div className="text-xs text-gray-400 mt-0.5 text-right">
                        edited
                      </div>
                    )}
                    {message.productCard && renderProductCard(message.productCard)}
                    <MessageStatus message={message} currentUser={currentUser} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Inbox = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useMerchAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to conversations
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(conversationsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!conversationId) return;

    // Listen to messages for current conversation
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
      
      // Update unread count and mark messages as read
      if (currentConversation) {
        // Mark messages as read
        const unreadMessages = snapshot.docs.filter(doc => 
          doc.data().senderId !== user.uid && 
          (!doc.data().read || !doc.data().delivered)
        );

        // Batch update for better performance
        if (unreadMessages.length > 0) {
          const batch = writeBatch(db);
          unreadMessages.forEach(doc => {
            batch.update(doc.ref, {
              delivered: true,
              read: true
            });
          });
          batch.commit();
        }

        // Reset unread count
        updateDoc(doc(db, 'conversations', conversationId), {
          [`unreadCount.${user.uid}`]: 0
        });
      }
    });

    return () => unsubscribe();
  }, [conversationId, currentConversation]);

  useEffect(() => {
    // Find and set current conversation
    const conversation = conversations.find(c => c.id === conversationId);
    setCurrentConversation(conversation);
  }, [conversationId, conversations]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately

    try {
      // Add new message
      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId: user.uid,
        text: messageText,
        timestamp: serverTimestamp(),
        delivered: false,
        read: false
      });

      // Update conversation
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: messageText,
        lastMessageTime: serverTimestamp(),
        [`unreadCount.${currentConversation.sellerId}`]: (currentConversation.unreadCount?.[currentConversation.sellerId] || 0) + 1,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setNewMessage(messageText); // Restore the message if sending fails
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    if (!newText.trim()) return;
    
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        text: newText.trim(),
        edited: true,
        editedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, 'messages', messageId));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50/30">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-12">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-12rem)] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => navigate(`/merch-store/inbox/${conversation.id}`)}
                    className={`w-full p-6 border-b border-gray-100 hover:bg-gray-50/80 transition-all ${
                      conversation.id === conversationId ? 'bg-gray-50/80' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className={`font-medium text-gray-800 truncate ${
                            conversation.unreadCount?.[user.uid] > 0 ? 'font-bold' : ''
                          }`}>
                            {user.uid === conversation.buyerId ? conversation.sellerName : conversation.buyerName}
                          </h3>
                          {conversation.isVerifiedSeller && user.uid === conversation.buyerId && (
                            <div className="group relative inline-flex items-center shrink-0">
                              <VerificationCheckmark className="!w-[10px] !h-[10px] min-w-[10px] min-h-[10px]" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1 py-0.5 bg-gray-900 text-white text-[8px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                                Verified Store
                              </div>
                            </div>
                          )}
                        </div>
                        <p className={`text-sm truncate ${
                          conversation.unreadCount?.[user.uid] > 0 
                            ? 'text-gray-900 font-medium' 
                            : 'text-gray-500'
                        }`}>
                          {conversation.lastMessage || 'No messages yet'}
                        </p>
                        {conversation.unreadCount?.[user.uid] > 0 && (
                          <div className="mt-1 text-xs text-[#FF1B6B]">
                            {conversation.unreadCount[user.uid]} new {conversation.unreadCount[user.uid] === 1 ? 'message' : 'messages'}
                          </div>
                        )}
                      </div>
                      {conversation.unreadCount?.[user.uid] > 0 && (
                        <span className="bg-[#FF1B6B] text-white text-xs px-2.5 py-1.5 rounded-full ml-3 shrink-0">
                          {conversation.unreadCount[user.uid]}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="col-span-8 bg-white">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => navigate(-1)}
                        className="md:hidden hover:text-[#FF1B6B] transition-colors"
                      >
                        <BiArrowBack className="text-xl" />
                      </button>
                      <h3 className="font-medium text-gray-800">
                        {user.uid === currentConversation.buyerId ? currentConversation.sellerName : currentConversation.buyerName}
                      </h3>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-6 overflow-y-auto h-[calc(100vh-16rem)] no-scrollbar">
                    {messages.map((message) => (
                      <Message
                        key={message.id}
                        message={message}
                        currentUser={user}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF1B6B] focus:ring-1 focus:ring-[#FF1B6B] transition-all"
                      />
                      <button
                        type="submit"
                        className="px-5 py-3 bg-[#FF1B6B] text-white rounded-xl hover:bg-[#D4145A] transition-colors"
                      >
                        <BiSend className="text-xl" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <div className="w-16 h-16 mb-4 text-gray-300">
                    <BiMessageDetail className="w-full h-full" />
                  </div>
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox; 
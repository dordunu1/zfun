import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { BiSend, BiArrowBack } from 'react-icons/bi';
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
      
      // Update unread count
      if (currentConversation) {
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

    try {
      // Add new message
      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId: user.uid,
        text: newMessage,
        timestamp: serverTimestamp()
      });

      // Update conversation
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp(),
        [`unreadCount.${currentConversation.sellerId}`]: (currentConversation.unreadCount?.[currentConversation.sellerId] || 0) + 1,
        updatedAt: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const renderProductCard = (productCard, message) => (
    <div className={`my-4 ${message.senderId === user.uid ? 'ml-auto' : ''} max-w-[280px]`}>
      <button 
        onClick={() => navigate(`/merch-store/product/${productCard.productId}`)}
        className={`w-full rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow ${
          message.senderId === user.uid ? 'border-pink-100' : 'border-gray-100'
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12">
            {/* Conversations List */}
            <div className="col-span-4 border-r">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-12rem)]">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => navigate(`/merch-store/inbox/${conversation.id}`)}
                    className={`w-full p-4 border-b hover:bg-gray-50 transition-colors ${
                      conversation.id === conversationId ? 'bg-gray-50' : ''
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
                        <span className="bg-[#FF1B6B] text-white text-xs px-2 py-1 rounded-full ml-3 shrink-0">
                          {conversation.unreadCount[user.uid]}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="col-span-8">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => navigate(-1)}
                        className="md:hidden"
                      >
                        <BiArrowBack className="text-xl" />
                      </button>
                      <h3 className="font-medium text-gray-800">
                        {user.uid === currentConversation.buyerId ? currentConversation.sellerName : currentConversation.buyerName}
                      </h3>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-4 overflow-y-auto h-[calc(100vh-16rem)]">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-4 ${message.senderId === user.uid ? 'text-right' : ''}`}
                      >
                        <div
                          className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                            message.senderId === user.uid
                              ? 'bg-[#FF1B6B] text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.text}
                        </div>
                        {message.productCard && renderProductCard(message.productCard, message)}
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#FF1B6B]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
                      >
                        <BiSend className="text-xl" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
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
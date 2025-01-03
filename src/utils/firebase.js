import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  where,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';

const MESSAGES_COLLECTION = 'messages';
const MESSAGE_LIMIT = 100;

export const sendMessage = async ({ text, sender, collectionAddress, replyTo = null }) => {
  try {
    const messagesRef = collection(db, 'collections', collectionAddress, 'messages');
    
    const messageData = {
      text: text.trim(),
      sender: sender.toLowerCase(),
      timestamp: serverTimestamp(),
    };

    // Only add reply-related fields if it's a reply
    if (replyTo) {
      messageData.replyTo = {
        messageId: replyTo.messageId,
        text: replyTo.text.substring(0, 100),
        sender: replyTo.sender.toLowerCase()
      };
      messageData.threadId = replyTo.threadId || replyTo.messageId;
      messageData.isThread = true;
      messageData.threadDepth = replyTo.threadDepth ? replyTo.threadDepth + 1 : 0;
    } else {
      // Explicitly set reply-related fields to null/false for normal messages
      messageData.replyTo = null;
      messageData.threadId = null;
      messageData.isThread = false;
      messageData.threadDepth = null;
    }

    await addDoc(messagesRef, messageData);
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};

export const subscribeToMessages = (collectionAddress, callback) => {
  const messagesRef = collection(db, 'collections', collectionAddress, 'messages');
  
  const q = query(
    messagesRef,
    orderBy('timestamp', 'desc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date()
      });
    });
    
    // Sort messages so threads appear after their parent messages
    const sortedMessages = messages.sort((a, b) => {
      // First sort by timestamp
      const timeCompare = a.timestamp - b.timestamp;
      if (timeCompare !== 0) return timeCompare;
      
      // If timestamps are equal, put replies after their parent messages
      if (a.threadId === b.id) return 1;
      if (b.threadId === a.id) return -1;
      
      return 0;
    });
    
    callback(sortedMessages);
  });
};

export const updateBannedUsers = async (collectionAddress, bannedList) => {
  try {
    // Use a separate moderation document in a subcollection
    const moderationRef = doc(db, 'collections', collectionAddress, 'moderation', 'bannedUsers');
    
    await setDoc(moderationRef, {
      addresses: bannedList,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating banned users:', error);
    throw error;
  }
};

// Add function to load banned users
export const loadBannedUsers = async (collectionAddress) => {
  try {
    const moderationRef = doc(db, 'collections', collectionAddress, 'moderation', 'bannedUsers');
    const docSnap = await getDoc(moderationRef);
    
    if (docSnap.exists()) {
      return docSnap.data().addresses || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading banned users:', error);
    return [];
  }
};

export const deleteMessage = async (collectionAddress, messageId) => {
  try {
    const messageRef = doc(db, 'collections', collectionAddress, 'messages', messageId);
    await deleteDoc(messageRef);
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error; // Throw error to handle it in the component
  }
}; 
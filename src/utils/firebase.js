import { db } from './firebase.config';
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
  Timestamp
} from 'firebase/firestore';

const MESSAGES_COLLECTION = 'messages';
const MESSAGE_LIMIT = 100;

export const sendMessage = async ({ text, sender, collectionAddress }) => {
  try {
    const messageData = {
      text: text.trim(),
      sender: sender.toLowerCase(),
      collectionAddress,
      timestamp: serverTimestamp()
    };

    await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    console.error('Error details:', error.message);
    return false;
  }
};

export const subscribeToMessages = (collectionAddress, callback) => {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where('collectionAddress', '==', collectionAddress),
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
    callback(messages.reverse());
  });
}; 
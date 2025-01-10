const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

exports.checkAndCancelOrders = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    try {
      // Query orders that are still processing and past their shipping deadline
      const ordersQuery = await db.collection('orders')
        .where('status', '==', 'processing')
        .where('shippingDeadline', '<', now)
        .get();

      if (ordersQuery.empty) {
        console.log('No orders to auto-cancel');
        return null;
      }

      const batch = db.batch();
      let cancelCount = 0;

      ordersQuery.forEach((doc) => {
        const orderRef = db.collection('orders').doc(doc.id);
        batch.update(orderRef, {
          status: 'cancelled',
          cancelReason: 'Auto-cancelled: Shipping deadline exceeded (3 days)',
          cancelledAt: now,
          updatedAt: now
        });
        cancelCount++;
      });

      await batch.commit();
      console.log(`Successfully auto-cancelled ${cancelCount} orders`);
      return null;
    } catch (error) {
      console.error('Error in auto-cancellation function:', error);
      return null;
    }
  }); 
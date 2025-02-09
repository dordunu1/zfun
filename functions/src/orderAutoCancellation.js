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
    
    console.log('=== Auto-cancellation function started ===');
    console.log('Current timestamp:', now.toDate().toISOString());

    try {
      // First, let's check all processing orders regardless of deadline
      const allProcessingOrders = await db.collection('orders')
        .where('status', '==', 'processing')
        .get();
      
      console.log('Total processing orders found:', allProcessingOrders.size);
      
      // Convert any JavaScript Date shippingDeadlines to Firestore Timestamps
      const batch = db.batch();
      let updateCount = 0;
      
      allProcessingOrders.forEach(doc => {
        const data = doc.data();
        console.log('Processing Order Details:', {
          orderId: doc.id,
          shippingDeadline: data.shippingDeadline?.toDate?.() || data.shippingDeadline,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          deadlineType: data.shippingDeadline?.constructor?.name
        });

        // If shippingDeadline is a Date or doesn't have toDate() method, convert it
        if (data.shippingDeadline && !data.shippingDeadline.toDate) {
          const deadline = data.shippingDeadline instanceof Date ? 
            data.shippingDeadline : 
            new Date(data.shippingDeadline);
            
          batch.update(doc.ref, {
            shippingDeadline: admin.firestore.Timestamp.fromDate(deadline)
          });
          updateCount++;
        }
      });

      // Commit any necessary conversions
      if (updateCount > 0) {
        await batch.commit();
        console.log(`Converted ${updateCount} orders to use Firestore Timestamps`);
      }

      // Now perform the actual cancellation query
      const ordersQuery = await db.collection('orders')
        .where('status', '==', 'processing')
        .where('shippingDeadline', '<', now)
        .get();

      console.log('Orders past deadline:', ordersQuery.size);

      if (ordersQuery.empty) {
        console.log('No orders to auto-cancel');
        return null;
      }

      const cancelBatch = db.batch();
      let cancelCount = 0;

      ordersQuery.forEach((doc) => {
        const data = doc.data();
        console.log('Cancelling order:', {
          orderId: doc.id,
          deadline: data.shippingDeadline.toDate().toISOString(),
          currentTime: now.toDate().toISOString(),
          hoursOverdue: (now.seconds - data.shippingDeadline.seconds) / 3600
        });

        cancelBatch.update(doc.ref, {
          status: 'cancelled',
          cancelReason: 'Auto-cancelled: Shipping deadline exceeded (3 days)',
          cancelledAt: now,
          updatedAt: now
        });
        cancelCount++;
      });

      await cancelBatch.commit();
      console.log(`Successfully auto-cancelled ${cancelCount} orders`);
      return null;
    } catch (error) {
      console.error('Error in auto-cancellation function:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      return null;
    }
  }); 
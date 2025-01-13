const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Mailjet = require('node-mailjet');

console.log('Email function file loaded');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  console.log('Initializing Firebase Admin');
  admin.initializeApp();
}

// Initialize Mailjet with environment variables
const MAILJET_API_KEY = functions.config().mailjet?.api_key;
const MAILJET_SECRET_KEY = functions.config().mailjet?.secret_key;

console.log('Mailjet API Key exists:', !!MAILJET_API_KEY);
console.log('Mailjet Secret Key exists:', !!MAILJET_SECRET_KEY);

const mailjet = Mailjet.apiConnect(
  MAILJET_API_KEY,
  MAILJET_SECRET_KEY
);

exports.sendOrderNotification = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '256MB'
  })
  .firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    console.log('🔥 Function triggered for orderId:', context.params.orderId);
    console.log('Function config:', JSON.stringify(functions.config(), null, 2));
    const startTime = Date.now();

    try {
      const order = snap.data();
      if (!order) {
        console.error('No order data found in snapshot');
        return null;
      }

      console.log('📦 Order data received:', {
        orderId: context.params.orderId,
        sellerId: order.sellerId,
        items: order.items?.length || 0,
        total: order.total
      });

      // Get seller data
      const sellerDoc = await admin.firestore()
        .collection('sellers')
        .doc(order.sellerId)
        .get();
      
      if (!sellerDoc.exists) {
        const error = `Seller ${order.sellerId} not found`;
        console.error('❌', error);
        await snap.ref.update({
          emailNotificationError: error,
          emailNotificationErrorAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return null;
      }

      const seller = sellerDoc.data();
      console.log('👤 Seller found:', {
        sellerId: order.sellerId,
        email: seller.contactEmail,
        name: seller.storeName || seller.name
      });

      // Prepare email content with error handling for missing data
      const firstItem = order.items?.[0] || {};
      const shippingAddress = order.shippingAddress || {};
      
      // Send email using Mailjet
      const emailData = {
        Messages: [
          {
            From: {
              Email: "notifications@token-factory.xyz",
              Name: "Token Factory"
            },
            To: [
              {
                Email: seller.contactEmail,
                Name: seller.storeName || seller.name || 'Store Owner'
              }
            ],
            Subject: "New Order Received! - Token Factory",
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #FF1B6B; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">New Order Received!</h1>
                </div>
                
                <div style="padding: 20px; border: 1px solid #eee; background: white;">
                  <h2 style="color: #333;">Order Details</h2>
                  
                  <div style="margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
                    <img src="${firstItem.image || ''}" alt="${firstItem.name || 'Product'}" style="width: 100%; max-width: 200px; border-radius: 8px;">
                    <h3 style="color: #333; margin: 10px 0;">${firstItem.name || 'Product'}</h3>
                    <p style="color: #666; margin: 5px 0;">Quantity: ${firstItem.quantity || 0}</p>
                    <p style="color: #FF1B6B; font-weight: bold; margin: 5px 0;">Total: $${order.total || 0}</p>
                  </div>

                  <div style="margin: 20px 0;">
                    <h3 style="color: #333;">Shipping Information</h3>
                    <p style="color: #666; margin: 5px 0;">
                      ${shippingAddress.street || ''}<br>
                      ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}<br>
                      ${shippingAddress.country?.name || shippingAddress.country || ''}
                    </p>
                  </div>

                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://token-factory.xyz/merch-store/orders-received" 
                       style="background: #FF1B6B; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                      View Orders
                    </a>
                  </div>
                </div>

                <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                  <p>This is an automated message from Token Factory. Please do not reply to this email.</p>
                </div>
              </div>
            `
          }
        ]
      };

      console.log('📧 Attempting to send email...');

      const response = await mailjet
        .post("send", { version: 'v3.1' })
        .request(emailData);

      console.log('✅ Mailjet response received:', {
        success: true,
        messageId: response.body?.Messages?.[0]?.To?.[0]?.MessageID
      });

      // Update order with email sent status
      await snap.ref.update({
        emailNotificationSent: true,
        emailNotificationSentAt: admin.firestore.FieldValue.serverTimestamp(),
        emailResponse: response.body
      });

      const duration = Date.now() - startTime;
      console.log(`✨ Order notification email sent successfully for order ${context.params.orderId}. Duration: ${duration}ms`);
      return { success: true, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ Error sending order notification:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        response: error.response?.body
      });
      console.error(`Failed after ${duration}ms`);
      
      // Update order with error status
      try {
        await snap.ref.update({
          emailNotificationError: error.message,
          emailNotificationErrorAt: admin.firestore.FieldValue.serverTimestamp(),
          emailErrorDetails: {
            code: error.code,
            message: error.message,
            stack: error.stack,
            response: error.response?.body
          }
        });
      } catch (updateError) {
        console.error('Error updating order with error status:', updateError);
      }
      
      throw error;
    }
  }); 
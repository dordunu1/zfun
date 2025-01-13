const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firebase Admin
admin.initializeApp();

// Export all functions
exports.email = require('./email'); 
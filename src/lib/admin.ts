// src/lib/admin.ts
import * as admin from 'firebase-admin';

// Initialize only once using Firebase App Hosting's built-in credentials
if (!admin.apps.length) {
  admin.initializeApp();
}

export { admin as app };

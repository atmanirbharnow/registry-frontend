// src/lib/admin.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp(); // Uses Firebase App Hosting's built-in credentials
}

export { admin as app };

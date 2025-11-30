// src/app/api/log-action/route.ts
import { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { app } from '@/lib/admin';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify authenticated request
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    // 2. Decode and verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 3. Parse request body
    const { actionType, notes, location } = await req.json();

    // 4. Validate required fields
    if (!actionType || !location?.latitude || !location?.longitude) {
      return Response.json({ error: 'Missing required fields: actionType, location.latitude, location.longitude' }, { status: 400 });
    }

    // 5. Save to Firestore
    const docRef = await firestore.collection('ecoActions').add({
      userId,
      actionType,
      notes: notes || '',
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      timestamp: new Date(),
      verified: false, // for future moderation
    });

    // 6. Return success
    return Response.json({ 
      success: true, 
      actionId: docRef.id,
      message: 'Action logged successfully' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Log action error:', error);
    
    // Handle common Firebase errors
    if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-user-token') {
      return Response.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    return Response.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}

// src/app/api/log-action/route.ts
import { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { app } from '@/lib/admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { actionType, notes, location } = await req.json();

    if (!actionType || !location?.latitude || !location?.longitude) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await firestore.collection('ecoActions').add({
      userId,
      actionType,
      notes: notes || '',
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      timestamp: new Date(),
      verified: false,
    });

    return Response.json({ success: true, actionId: docRef.id });
  } catch (error: any) {
    console.error('Log action error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

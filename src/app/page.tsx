// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';

// 🔑 Use only Firebase auto-generated config (from .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number | null; lng: number | null; error: string | null }>({
    lat: null,
    lng: null,
    error: null,
  });
  const [formData, setFormData] = useState({
    actionType: 'tree_planted',
    notes: '',
    manualLat: '',
    manualLng: '',
  });
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Auto-capture location when user logs in
  useEffect(() => {
    if (user && !location.lat) {
      setGeoLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude, error: null });
            setFormData((prev) => ({ ...prev, manualLat: String(latitude), manualLng: String(longitude) }));
            setGeoLoading(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setLocation({ lat: null, lng: null, error: 'Location access denied or unavailable.' });
            setGeoLoading(false);
          }
        );
      } else {
        setLocation({ lat: null, lng: null, error: 'Geolocation not supported by your browser.' });
        setGeoLoading(false);
      }
    }
  }, [user, location.lat]);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed: ' + (error.message || 'Please try again.'));
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    const lat = parseFloat(formData.manualLat) || location.lat;
    const lng = parseFloat(formData.manualLng) || location.lng;

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      setSubmitStatus('Please allow location access or enter valid coordinates.');
      return;
    }

    if (!user) {
      setSubmitStatus('You must be signed in to log an action.');
      return;
    }

    try {
      // Get ID token for secure API authentication
      const idToken = await user.getIdToken();

      const response = await fetch('/api/log-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          actionType: formData.actionType,
          notes: formData.notes,
          location: {
            latitude: lat,
            longitude: lng,
          },
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('✅ Action successfully saved to the registry!');
        // Reset form but keep location
        setFormData({
          actionTime: 'tree_planted',
          notes: '',
          manualLat: String(lat),
          manualLng: String(lng),
        });
      } else {
        setSubmitStatus(`❌ Save failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmitStatus(`❌ Network error: ${error.message || 'Please check your connection.'}`);
    }

    // Clear status after 4 seconds
    setTimeout(() => setSubmitStatus(null), 4000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading Earth Carbon Registry...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Earth Carbon Registry</h1>
          <p className="text-gray-600 mb-6">
            Join India’s Atmanirbhar climate movement. Log, verify, and visualize your low-carbon actions with geotagged proof.
          </p>
          <button
            onClick={handleSignIn}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition shadow-md"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Earth Carbon Registry</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Sign out
        </button>
      </header>

      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Log a New Eco-Action</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Action Type</label>
            <select
              name="actionType"
              value={formData.actionType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="tree_planted">🌳 Tree Planted</option>
              <option value="plastic_avoided">♻️ Plastic Avoided</option>
              <option value="water_saved">💧 Water Saved</option>
              <option value="energy_saved">⚡ Energy Saved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location (Auto-captured)</label>
            {geoLoading ? (
              <p className="text-gray-500">Detecting your location...</p>
            ) : location.error ? (
              <p className="text-red-600 text-sm">{location.error}</p>
            ) : (
              <p className="text-sm text-gray-600">
                {location.lat?.toFixed(5)}, {location.lng?.toFixed(5)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude (override)</label>
              <input
                type="number"
                name="manualLat"
                value={formData.manualLat}
                onChange={handleInputChange}
                step="0.00001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="e.g. 23.0225"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude (override)</label>
              <input
                type="number"
                name="manualLng"
                value={formData.manualLng}
                onChange={handleInputChange}
                step="0.00001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="e.g. 72.5714"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="e.g. Neem sapling planted near home"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
            disabled={!!submitStatus?.includes('Saving')}
          >
            Log This Action
          </button>

          {submitStatus && (
            <div
              className={`mt-2 p-2 rounded text-center text-sm ${
                submitStatus.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {submitStatus}
            </div>
          )}
        </form>
      </div>

      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">✅ Your geotagged actions will appear on this map soon!</p>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Logged in as: {user.email}
      </div>
    </div>
  );
}

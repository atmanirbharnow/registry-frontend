// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// 🔑 YOUR FIREBASE CONFIG (auto-injected by Firebase App Hosting)
// No need to hardcode — but we include it for clarity
const firebaseConfig = {
  apiKey: "AIzaSyCa5Jly0Y8Bk_bd3Yq7SCLtFYs8UP5ebsA",
  authDomain: "earthcarbonregistry-1e6ba.firebaseapp.com",
  projectId: "earthcarbonregistry-1e6ba",
  storageBucket: "earthcarbonregistry-1e6ba.firebasestorage.app",
  messagingSenderId: "217692090833",
  appId: "1:217692090833:web:23be9c18af75a0382870f0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("Sign-in failed: " + error.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Earth Carbon Registry</h1>
          <p className="text-gray-600 mb-6">
            Join India’s Atmanirbhar climate movement. Log, verify, and visualize your low-carbon actions.
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
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.displayName}!</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Sign out
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Actions</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">CO₂ Saved</p>
          <p className="text-2xl font-bold">0 kg</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-2xl font-bold">0 days</p>
        </div>
      </div>

      <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Interactive map of your geotagged eco-actions (coming soon)</p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">
          💡 <strong>Next step:</strong> Click “Log Action” to record your first tree planted, plastic avoided, or energy saved.
        </p>
      </div>
    </div>
  );
}

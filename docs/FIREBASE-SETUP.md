# Firebase Account Setup Guide - Step by Step

This guide will walk you through creating a Firebase account, setting up your project, and getting the keys you need to run this application.

---

## 📝 Step 1: Create a Google Account (If You Don't Have One)

1. Go to [Google Account Sign Up](https://accounts.google.com/signup)
2. Fill in your information and create your account
3. Verify your email address if required

**Note:** You can use any existing Google account if you already have one.

---

## 🔥 Step 2: Create a Firebase Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. You'll see the Firebase welcome screen

---

## 🆕 Step 3: Create Your First Firebase Project

1. Click the **"Add project"** button (or "Create a project" if it's your first time)
2. **Enter a project name:**
   - For this project, use: `registry-backbone`
   - Or any name you prefer (you can change it later)
3. Click **"Continue"**
4. **Google Analytics Setup:**
   - You can choose to enable or disable Google Analytics
   - For this project, you can disable it (toggle it off)
   - Click **"Continue"**
5. **Review and Create:**
   - Review your project settings
   - Click **"Create project"**
6. Wait for Firebase to set up your project (this takes about 30 seconds)
7. When you see "Your new project is ready", click **"Continue"**

**Congratulations!** You've created your Firebase project. 🎉

---

## 🗄️ Step 4: Enable Firestore Database

Firestore is the database where your project data will be stored. You need to enable it:

1. In the Firebase Console, look at the left sidebar menu
2. Click on **"Build"** (or look for the database icon)
3. Click on **"Firestore Database"**
4. Click the **"Create database"** button
5. **Choose your security rules:**
   - For development/testing: Select **"Start in test mode"**
   - For production: Select **"Start in production mode"** (requires security rules setup)
   - For now, choose **"Start in test mode"** and click **"Next"**
6. **Choose a location:**
   - Select a location close to you (e.g., `eur3` for Europe, `us-central1` for US)
   - This cannot be changed later, so choose carefully
   - Click **"Enable"**
7. Wait for Firestore to be created (takes about 1 minute)

**Great!** Your database is now ready. ✅

---

## 🔑 Step 5: Get Your Firebase Configuration Keys

Now you need to get the keys that will connect your application to Firebase:

1. In Firebase Console, look at the top left corner
2. Click the **gear icon** ⚙️ next to "Project Overview"
3. Select **"Project settings"** from the dropdown menu
4. Scroll down to the **"Your apps"** section
5. You'll see different platform icons (iOS, Android, Web)
6. Click the **Web icon** `</>` (it looks like `</>`)
7. **Register your app:**
   - Enter an app nickname: `Registry Frontend` (or any name you like)
   - You can skip the Firebase Hosting setup for now
   - Click **"Register app"**
8. **Copy your configuration:**
   - You'll see a code block that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

9. **You need to copy these 3 values:**
   - `apiKey` - This is your API key
   - `authDomain` - This is your authentication domain
   - `projectId` - This is your project ID

**Keep this window open** - you'll need these values in the next step!

---

## 📁 Step 6: Create the .env.local File

Now you need to create a file in your project folder to store these keys securely.

### 6.1 Find Your Project Folder

1. Open File Explorer (Windows) or Finder (Mac)
2. Navigate to your project folder: `registry-frontend`
3. This is the main folder where you see files like `package.json`, `next.config.js`, etc.

### 6.2 Create the .env.local File

**For Windows:**
1. In the `registry-frontend` folder, right-click in an empty space
2. Select **"New"** → **"Text Document"**
3. Name it exactly: `.env.local` (including the dot at the beginning)
4. If Windows warns you about changing the file extension, click **"Yes"**

**For Mac/Linux:**
1. Open a text editor (like TextEdit or VS Code)
2. Create a new file
3. Save it as `.env.local` in the `registry-frontend` folder

**Important:** The file must be named exactly `.env.local` (with the dot at the beginning, no extension)

### 6.3 Add Your Firebase Keys

Open the `.env.local` file in a text editor and add the following content:

```env
# Firebase Configuration
# These values connect your application to Firebase

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain-here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id-here

# Seed Key (create any random secret string)
# This protects the database seeding endpoint
SEED_KEY=your-secret-key-here
```

### 6.4 Replace the Placeholder Values

Now replace the placeholder text with your actual Firebase values:

1. **NEXT_PUBLIC_FIREBASE_API_KEY:**
   - Copy the `apiKey` value from Firebase Console
   - Replace `your-api-key-here` with your actual API key
   - Example: `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDQa_5ayh8d072K0qDwFNpIobakbyTSMPM`

2. **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:**
   - Copy the `authDomain` value from Firebase Console
   - Replace `your-auth-domain-here` with your actual auth domain
   - Example: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=registry-backbone.firebaseapp.com`

3. **NEXT_PUBLIC_FIREBASE_PROJECT_ID:**
   - Copy the `projectId` value from Firebase Console
   - Replace `your-project-id-here` with your actual project ID
   - Example: `NEXT_PUBLIC_FIREBASE_PROJECT_ID=registry-backbone`

4. **SEED_KEY:**
   - Create any random secret string (this is for protecting the seed endpoint)
   - It can be anything you want, like: `super-secret`, `mySecretKey123!`, etc.
   - Example: `SEED_KEY=super-secret`

### 6.5 Example of Completed .env.local File

Here's what your completed `.env.local` file should look like (with example values):

```env
# Firebase Configuration
# These values connect your application to Firebase

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDQa_5ayh8d072K0qDwFNpIobakbyTSMPM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=registry-backbone.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=registry-backbone

# Seed Key (create any random secret string)
# This protects the database seeding endpoint
SEED_KEY=super-secret
```

**Important Notes:**
- ✅ Make sure there are **no spaces** around the `=` sign
- ✅ Make sure there are **no quotes** around the values
- ✅ Make sure each value is on its own line
- ✅ Don't add any extra characters or spaces

### 6.6 Save the File

1. Save the file (Ctrl+S or Cmd+S)
2. Make sure it's saved in the `registry-frontend` folder (same folder as `package.json`)
3. Close the file

---

## ✅ Step 7: Verify Your Setup

Let's make sure everything is set up correctly:

1. **Check that .env.local exists:**
   - Go to your `registry-frontend` folder
   - You should see a file named `.env.local`
   - If you don't see it, you might need to enable "Show hidden files" in your file explorer

2. **Check the file contents:**
   - Open `.env.local` in a text editor
   - Verify all 4 lines are present:
     - `NEXT_PUBLIC_FIREBASE_API_KEY=...`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID=...`
     - `SEED_KEY=...`
   - Make sure none of the values say "your-...-here" (they should have actual values)

3. **Verify Firebase project:**
   - Go back to [Firebase Console](https://console.firebase.google.com/)
   - Make sure you can see your project
   - Go to Firestore Database and verify it's enabled

---

## 🎯 Quick Reference: What Each Key Does

| Key Name | What It Does | Where to Find It |
|----------|-------------|------------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Allows your app to communicate with Firebase | Firebase Console → Project Settings → Your apps → Web app → `apiKey` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Authentication domain for your Firebase project | Firebase Console → Project Settings → Your apps → Web app → `authDomain` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Unique identifier for your Firebase project | Firebase Console → Project Settings → Your apps → Web app → `projectId` |
| `SEED_KEY` | Secret key to protect the database seeding endpoint | You create this yourself (any random string) |

---

## 🛠️ Troubleshooting

### Problem: I can't see the .env.local file

**Solution:**
- On Windows: In File Explorer, go to "View" → Check "Hidden items"
- The file might be hidden because it starts with a dot
- Try creating it again with a text editor

### Problem: I can't find the Firebase configuration keys

**Solution:**
1. Make sure you've registered a web app in Firebase Console
2. Go to: Firebase Console → Project Settings → Your apps
3. If you don't see a web app, click the `</>` icon to add one
4. The configuration will appear after you register the app

### Problem: The values don't work / I get Firebase errors

**Solution:**
1. Double-check that you copied the values correctly (no extra spaces)
2. Make sure there are no quotes around the values in `.env.local`
3. Make sure the file is named exactly `.env.local` (not `.env.local.txt`)
4. Restart your development server after creating/modifying `.env.local`
5. Verify your Firebase project is active in Firebase Console

### Problem: I accidentally shared my keys

**Solution:**
1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. You can regenerate API keys if needed
4. Update your `.env.local` file with the new keys
5. **Important:** Never commit `.env.local` to Git (it's already in `.gitignore`)

---

## 🔒 Security Reminders

⚠️ **IMPORTANT SECURITY NOTES:**

1. **Never share your `.env.local` file** - It contains sensitive keys
2. **Never commit it to Git** - It should already be in `.gitignore`
3. **Don't post these keys online** - Keep them private
4. **Use different keys for development and production** - Don't use the same keys for both
5. **If keys are exposed** - Regenerate them immediately in Firebase Console

---

## ✅ You're All Set!

Once you've completed these steps:

1. ✅ Firebase account created
2. ✅ Firebase project created
3. ✅ Firestore database enabled
4. ✅ Configuration keys obtained
5. ✅ `.env.local` file created with all keys

**Next Steps:**
- Go back to the main README file (`docs/firestore-schema.md`)
- Follow the instructions to install dependencies (`npm install`)
- Run the project (`npm run dev`)
- Your application should now connect to Firebase successfully!

---

## 📞 Need Help?

If you're stuck:

1. **Check Firebase Console:**
   - Make sure your project is active
   - Verify Firestore Database is enabled
   - Confirm you've registered a web app

2. **Check your .env.local file:**
   - Open it and verify all 4 keys are present
   - Make sure values don't have quotes or extra spaces
   - Ensure the file is in the correct location (same folder as `package.json`)

3. **Common mistakes:**
   - File named incorrectly (should be `.env.local`, not `.env.local.txt`)
   - Values have quotes around them (remove quotes)
   - Extra spaces around the `=` sign (remove spaces)
   - Wrong folder location (should be in `registry-frontend` root folder)

---

**Last Updated:** 2024  
**Firebase Setup Guide Version:** 1.0

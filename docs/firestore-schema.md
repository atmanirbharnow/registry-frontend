# Project Registry Frontend - Complete Setup Guide

## 📋 What is This Project?

This is a **Project Registry System** - a web application that helps manage and evaluate projects for carbon credit eligibility. Think of it as a digital filing cabinet where you can:

- Register new projects
- Check if projects are eligible for carbon credits
- Track project information, actions, and contributors
- View impact logs and eligibility status

The system uses **Firebase** (Google's cloud database) to store all your project data securely in the cloud.

---

## 🚀 Getting Started - Step by Step

### Prerequisites (What You Need First)

Before you can run this project, you need to have these installed on your computer:

1. **Node.js** (Version 18 or higher)
   - Download from: https://nodejs.org/
   - This allows your computer to run JavaScript applications
   - After installing, you can verify by opening a terminal and typing: `node --version`

2. **npm** (Node Package Manager)
   - This comes automatically with Node.js
   - Verify it's installed: `npm --version`

3. **Firebase Account**
   - Sign up for free at: https://firebase.google.com/
   - You'll need this to get your Firebase configuration keys

---

## 🔑 Step 1: Setting Up Firebase

> **📘 Detailed Guide Available:** For a complete step-by-step guide with screenshots and detailed instructions, see **[FIREBASE-SETUP.md](./FIREBASE-SETUP.md)**. This guide covers everything from creating a Firebase account to setting up your `.env.local` file.

### 1.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "registry-backbone")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click **"Create project"**

### 1.2 Get Your Firebase Configuration Keys

Once your Firebase project is created:

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>` to add a web app
5. Register your app with a nickname (e.g., "Registry Frontend")
6. You'll see a configuration object that looks like this:

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

**Save these values - you'll need them in the next step!**

### 1.3 Enable Firestore Database

1. In Firebase Console, go to **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development) or **"Start in production mode"** (for production)
4. Select a location (e.g., "eur3" - Europe)
5. Click **"Enable"**

---

## 🔐 Step 2: Setting Up Environment Variables

> **💡 Need Help?** For detailed instructions on creating your `.env.local` file with all the correct values, see the **[FIREBASE-SETUP.md](./FIREBASE-SETUP.md)** guide, specifically Step 6.

Environment variables are like secret keys that your application needs to connect to Firebase. You need to create a file called `.env.local` in the root folder of your project.

### 2.1 Create the Environment File

1. In your project folder (`registry-frontend`), create a new file named `.env.local`
2. Open this file in a text editor
3. Add the following content, replacing the placeholder values with your actual Firebase keys:

```env
# Firebase Configuration
# Get these values from Firebase Console → Project Settings → Your apps → Web app config

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Seed Key (for database seeding - create a random secret string)
# This is used to protect the seed endpoint
SEED_KEY=your-secret-seed-key-here
```

### 2.2 Fill in Your Values

Replace the placeholder values:

- **NEXT_PUBLIC_FIREBASE_API_KEY**: Copy from your Firebase config (the `apiKey` value)
- **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**: Copy from your Firebase config (the `authDomain` value)
- **NEXT_PUBLIC_FIREBASE_PROJECT_ID**: Copy from your Firebase config (the `projectId` value)
- **SEED_KEY**: Create any random secret string (e.g., `mySecretKey123!@#`)

**Example of a completed `.env.local` file:**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=registry-backbone.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=registry-backbone
SEED_KEY=mySecretSeedKey2026!
```

### ⚠️ Important Security Notes:

- **Never share your `.env.local` file** - it contains sensitive information
- **Never commit it to Git** - it should already be in `.gitignore`
- Keep your Firebase API keys secure
- If keys are exposed, regenerate them in Firebase Console

---

## 📦 Step 3: Installing Dependencies

Dependencies are like tools your project needs to work. You need to install them once.

1. Open a terminal/command prompt in your project folder
2. Run this command:

```bash
npm install
```

This will download and install all required packages (it may take a few minutes).

---

## 🏃 Step 4: Running the Project

### Development Mode (For Testing)

To run the project in development mode (with live updates):

```bash
npm run dev
```

You should see a message like:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

Open your web browser and go to: **http://localhost:3000**

### Production Mode (For Deployment)

1. First, build the project:
```bash
npm run build
```

2. Then, start the production server:
```bash
npm start
```

---

## 🌐 API Endpoints (How to Use the System)

The project has several API endpoints that allow you to interact with the system. Think of these as different doors to access different features.

### 1. Evaluate Eligibility

**Endpoint:** `POST /api/eligibility/evaluate`

**What it does:** Checks if a project is eligible for carbon credits

**How to use it:**
- Send a POST request to: `http://localhost:3000/api/eligibility/evaluate`
- Include the project ID in the request body:

```json
{
  "projectId": "your-project-id-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Eligibility evaluated successfully",
  "result": {
    "status": "yes",
    "reason": "Project is eligible for carbon credits"
  }
}
```

**Possible status values:**
- `"yes"` - Project is eligible
- `"no"` - Project is not eligible
- `"conditional"` - Project needs more information

### 2. Seed Database (Add Sample Data)

**Endpoint:** `POST /api/internal/seed`

**What it does:** Adds sample/test data to your database

**How to use it:**
- Send a POST request to: `http://localhost:3000/api/internal/seed`
- Include the seed key in the request header:

```
X-Seed-Key: your-secret-seed-key-here
```

(Use the same value you set in `SEED_KEY` in your `.env.local` file)

**Response:**
```json
{
  "message": "Seed completed successfully",
  "result": {
    "success": true,
    "message": "Seed completed successfully",
    "result": {
      "ProjectId": "generated-project-id"
    }
  }
}
```

**⚠️ Security Note:** This endpoint is protected by the seed key. Only use it during development or with proper authentication.

---

## 📊 Database Structure (Firestore Schema)

Your Firebase database stores information in "collections" (like folders) and "documents" (like files). Here's what each collection stores:

### 1. **projects** Collection
The main registry of all projects.

**Fields:**
- `name` - Project name (text)
- `ownership` - Who owns the project (text)
- `baseline_type` - Type of baseline (text)
- `commissioning_date` - When project was commissioned (date: YYYY-MM-DD)
- `scale_flag` - Project scale: `"standalone"` or `"basketed"`
- `eligibility_flag` - Current eligibility: `"yes"`, `"no"`, or `"conditional"`
- `created_at` - When record was created (timestamp)
- `updated_at` - When record was last updated (timestamp)

### 2. **actions** Collection
Records actions related to projects.

**Fields:**
- `project_id` - Reference to the project (text)
- `action_type` - Type of action (text)
- `action_date` - When action occurred (date)
- `created_at` - When record was created (timestamp)
- `updated_at` - When record was last updated (timestamp)

### 3. **contributors** Collection
People or organizations associated with projects.

**Fields:**
- `project_id` - Reference to the project (text)
- `name` - Contributor name (text)
- `role` - Contributor role (text)
- `created_at` - When record was created (timestamp)
- `updated_at` - When record was last updated (timestamp)

### 4. **impact_logs** Collection
Impact records for projects (optional/demonstrative).

**Fields:**
- `project_id` - Reference to the project (text)
- `tco2e` - Carbon impact value (number)
- `note` - Additional notes (text)
- `logged_at` - When impact was logged (timestamp)
- `created_at` - When record was created (timestamp)
- `updated_at` - When record was last updated (timestamp)

### 5. **eligibility_status** Collection
Results of eligibility evaluations.

**Fields:**
- `project_id` - Reference to the project (text)
- `status` - Eligibility outcome: `"yes"`, `"no"`, or `"conditional"`
- `reason` - Explanation for the outcome (text)
- `evaluation_date` - When evaluation was performed (timestamp)
- `created_at` - When record was created (timestamp)
- `updated_at` - When record was last updated (timestamp)

---

## 🧮 How Eligibility Evaluation Works

The system automatically evaluates projects based on simple rules:

1. **Missing Information** → Status: `"conditional"`
   - If required fields (ownership, baseline_type) are missing

2. **Invalid Date** → Status: `"no"`
   - If commissioning date is in the past

3. **All Criteria Met** → Status: `"yes"`
   - If all required information is present and valid

**Note:** This is a simple rule-based system. No complex scoring or machine learning is used.

---

## 🛠️ Troubleshooting Common Issues

### Issue: "Cannot find module" error
**Solution:** Run `npm install` again to ensure all dependencies are installed.

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution:** 
- Check your `.env.local` file exists
- Verify your Firebase API key is correct
- Make sure there are no extra spaces in your environment variables
- Restart your development server after changing `.env.local`

### Issue: "Project not found" error
**Solution:** 
- Make sure you've seeded the database first using the seed endpoint
- Verify the project ID exists in your Firestore database

### Issue: Port 3000 already in use
**Solution:** 
- Close other applications using port 3000
- Or change the port by running: `npm run dev -- -p 3001`

### Issue: Environment variables not working
**Solution:**
- Make sure the file is named exactly `.env.local` (with the dot at the beginning)
- Restart your development server after creating/modifying `.env.local`
- Check that variable names start with `NEXT_PUBLIC_` for client-side variables

---

## 📁 Project Structure

Here's what the main folders and files do:

```
registry-frontend/
├── src/
│   ├── app/                    # Main application pages
│   │   ├── api/                # API endpoints
│   │   │   ├── eligibility/    # Eligibility evaluation API
│   │   │   └── internal/       # Internal APIs (seed)
│   │   ├── about/              # About page
│   │   ├── how-it-works/       # How it works page
│   │   ├── impact/             # Impact page
│   │   ├── pricing/            # Pricing page
│   │   └── page.tsx            # Home page
│   ├── lib/
│   │   ├── firebase.ts         # Firebase connection setup
│   │   └── eligibility.tsx     # Eligibility evaluation logic
│   └── scripts/
│       └── seed.js             # Database seeding script
├── functions/                  # Firebase Cloud Functions
├── docs/                       # Documentation (this file)
├── .env.local                  # Your environment variables (create this)
├── package.json                # Project dependencies
├── firebase.json               # Firebase configuration
└── .firebaserc                 # Firebase project settings
```

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different keys for development and production**
3. **Rotate your Firebase keys** if they're ever exposed
4. **Protect the seed endpoint** - Only use it in secure environments
5. **Set up Firestore security rules** for production (see `firestore.rules`)

---

## 📝 Next Steps

After setting up:

1. ✅ Verify Firebase connection works
2. ✅ Seed the database with sample data
3. ✅ Test the eligibility evaluation endpoint
4. ✅ Explore the web pages at `http://localhost:3000`
5. ✅ Review Firestore security rules before going to production

---

## Need Help?

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Verify all environment variables are set correctly
3. Ensure Firebase project is set up properly
4. Check that Firestore database is enabled
5. Review the browser console and terminal for error messages

---

## 📄 License & Notes

- This is Phase 1 of the registry system
- The schema is intentionally minimal and governance-first
- No UI dashboards or advanced features are included in Phase 1
- All data is stored in Firebase Firestore cloud database

---

**Last Updated:** 2024
**Project Version:** 1.0.0
**Node.js Version Required:** 18.x or higher

# Firebase Configuration Setup

## Current Status
Your Firebase configuration is set up to use environment variables, but you need to add your actual Firebase credentials.

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or use existing project
3. Follow the setup wizard

## Step 2: Get Your Firebase Credentials
1. In Firebase Console → **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** → **Web app** (</> icon)
4. Register your app with a name like "Nithyanruthya Aradana"
5. Copy the `firebaseConfig` object values

## Step 3: Create .env.local File
Create a file named `.env.local` in your project root with these variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 4: Enable Firebase Services
In your Firebase Console, enable these services:

### Firestore Database
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to your users

### Storage
1. Go to **Storage**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Select the same location as Firestore

### Authentication (Optional)
1. Go to **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **Email/Password** if you want user authentication

## Step 5: Update Firestore Rules
Your current `firestore.rules` file should work, but you can customize it in Firebase Console → Firestore Database → Rules.

## Step 6: Restart Development Server
After adding your credentials to `.env.local`:
```bash
npm run dev
```

## Example Firebase Config
Your `firebaseConfig` object from Firebase Console will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ",
  authDomain: "myproject.firebaseapp.com",
  projectId: "myproject",
  storageBucket: "myproject.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

Convert it to environment variables:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Current App Behavior
- ✅ App runs without errors using mock Firebase objects
- ✅ No console errors or connection issues
- ⚠️ Data is mock/placeholder until you add real credentials
- ✅ All features work, but data won't persist

## After Setup
Once you add real Firebase credentials:
- ✅ Real data will be fetched from Firestore
- ✅ Images can be uploaded to Firebase Storage
- ✅ Contact forms will save to database
- ✅ Admin panel will manage real content

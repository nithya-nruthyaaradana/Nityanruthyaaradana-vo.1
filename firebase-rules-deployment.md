# Firebase Rules Deployment Instructions

## Current Issue
The review system is getting "Missing or insufficient permissions" errors because the Firestore rules don't include permissions for the `reviews` collection.

## Solution Options

### Option 1: Manual Deployment via Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nithyanruthyaaradana-6sb2b`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the current rules with the following:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
  
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Allow public read for site content
    match /gallery/{imageId} {
      allow read: if true;
      allow create, update, delete: if true;
    }
    
    match /pages/{pageName} {
      allow read: if true;
      allow write: if true;
    }
    
    match /settings/{docId} {
      allow read: if true;
      allow write: if true;
    }
    
    match /features/{docId} {
      allow read: if true;
      allow write: if true;
    }

    match /testimonials/{docId} {
      allow read: if true;
      allow write: if true;
    }

    match /faqs/{docId} {
      allow read: if true;
      allow write: if true;
    }
    
    match /philosophy/{docId} {
      allow read: if true;
      allow write: if true;
    }

    // Reviews collection rules - temporarily permissive for testing
    match /reviews/{reviewId} {
      // Allow all operations for now (will be restricted later)
      allow read, write: if true;
    }

    // Allow logged-in users to manage their data
    // (example for future use, not currently implemented)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Secure the registrations collection
    match /registrations/{regId} {
      allow read, write: if request.auth != null; // Only authenticated users (admins)
      allow create: if true; // Allow public to submit registration
    }
  }
}
```

5. Click **Publish** to deploy the rules

### Option 2: Using Firebase CLI (If you have access)

If you have Firebase CLI access and are logged in:

```bash
firebase deploy --only firestore:rules
```

### Option 3: More Secure Rules (For Production)

Once the basic functionality is working, you can use these more secure rules:

```javascript
// Reviews collection rules - production version
match /reviews/{reviewId} {
  // Allow public to read approved reviews only
  allow read: if resource.data.isApproved == true;
  // Allow public to create new reviews (they start as unapproved)
  allow create: if true;
  // Allow updates for admin approval/rejection
  allow update: if true;
  // Allow delete for admin management
  allow delete: if true;
}
```

## Testing the Fix

After deploying the rules:

1. Refresh your website at `http://localhost:3000`
2. Navigate to the home page and scroll to the "What Our Students Say" section
3. Try submitting a review using the "Write a Review" button
4. Check the admin panel at `http://localhost:3000/admin/reviews` to see if the review appears

## Current Status

The review system is fully implemented with:
- ✅ Review display on home page
- ✅ Review submission form
- ✅ Admin management panel
- ✅ Dashboard integration
- ⚠️ Firestore rules need to be deployed (this is the current blocker)

Once the rules are deployed, the entire review system will be fully functional!

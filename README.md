# Tally

A minimalist to-do app with lists, a Planner, due dates and do dates, that syncs across Mac, iPhone and iPad.

This folder is the web app. GitHub Pages hosts it, and your tasks sync through your own Firebase
database. Only your account can read them.

- `firebase-config.js`: your Firebase project's web settings. These identify the project and are not passwords.
- `index.html`, `cloud.js`, `sw.js`, `manifest.webmanifest`, `icons/`, `fonts/`: the app itself. `cloud.js` bundles
  the Firebase SDK (v10.14.1) so the app opens offline.

## Database rules

Paste these in Firebase › Firestore Database › Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

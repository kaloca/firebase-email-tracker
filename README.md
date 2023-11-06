# Email Tracker

Email Tracker is a Next.js application that enables users to generate a unique tracking pixel that can be inserted into emails. When the recipient opens the email, the tracking pixel sends data back to the Firestore database, providing insights into email open rates.

## Features

- Generate a tracking pixel for email tracking.
- Collect email open data securely in Firestore.
- Integrate seamlessly with any email client.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js installed on your local machine.
- A Firebase account for the Firestore database.
- A Vercel account for deployment (optional for local development).

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/kaloca/firebase-email-tracker.git
   ```
2. Navigate to the cloned directory:
   ```
   cd firebase-email-tracker
   ```
3. Install the dependencies with npm:
   ```
   npm install
   ```

### Configuring Firestore Database

To set up your Firestore database, follow these instructions:

1. Visit the [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project or select an existing one.
3. Navigate to 'Project settings' > 'Service accounts'.
4. Generate a new private key and download the JSON file.

### Environment Setup

1. Create a new file named `.env.local` in the root of your project.
2. Open the `.env.local` file and configure your Firebase credentials and NextAuth secret as follows:

```plaintext
FIREBASE_PROJECT_ID=[YOUR PROJECT ID]
FIREBASE_CLIENT_EMAIL=[YOUR CLIENT EMAIL]
FIREBASE_PRIVATE_KEY={"privateKey":"-----BEGIN PRIVATE KEY-----\n[YOUR PRIVATE KEY]\n-----END PRIVATE KEY-----"}
NEXTAUTH_SECRET=[RANDOM SECRET]
```
Use these same values when deploying to Vercel.

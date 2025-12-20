# SkillDeck

A professional profile showcase platform built with Next.js and Firebase. Users can create, manage, and share their professional portfolios, featuring skills and proof of work.

## Features

- **Authentication**: Secure sign-up and login with Firebase Auth.
- **Profile Management**: Create and edit professional profiles.
- **Skills & Proof of Work**: Showcase your expertise and link to your projects.
- **Public Profiles**: shareable URLs for individual user profiles.

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd Skilldeck
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # Firebase Client (Required)
    NEXT_PUBLIC_FIREBASE_API_KEY=xxx
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
    NEXT_PUBLIC_FIREBASE_APP_ID=xxx

    # Firebase Admin (Required for Deployment)
    FIREBASE_PROJECT_ID=xxx
    FIREBASE_CLIENT_EMAIL=xxx
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Deployment to Vercel

To deploy this project to Vercel:

1.  **Link your repository** to a new Vercel project.
2.  **Add all Environment Variables** listed above in the Vercel dashboard.
    - **Note on FIREBASE_PRIVATE_KEY**: When adding this variable in Vercel, ensure you include the full string (including the BEGIN and END lines) and wrap it in double quotes if it contains newline characters. It is safer to paste the literal value as retrieved from your `service-account.json`.
3.  **Deploy**. Vercel will automatically run `npm run build` and set up the edge functions.

## Troubleshooting Build Errors

If you encounter `Type error: Cannot find module...` errors during build after renaming or deleting routes, run:
```bash
# Clean stale build caches
powershell -Command "Remove-Item .next -Recurse -Force; Remove-Item next-env.d.ts -Force; Remove-Item tsconfig.tsbuildinfo -Force"
npm run build
```

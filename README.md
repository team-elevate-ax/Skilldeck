# SkillDeck

SkillDeck is a professional portfolio platform that enables job seekers to showcase their skills, proof of work, and online presence through a clean, shareable professional deck.

## 🚀 Key Features

- **Professional Profile**: Create a dedicated page with your bio, headline, and social links.
- **Skill Showcasing**: Highlight your core competencies with a dynamic skill tagging system.
- **Proof of Work**: Link directly to your projects, repositories, or published work to provide verifiable evidence of your expertise.
- **Cloudinary Integration**: Upload and manage profile pictures seamlessly with optimized image hosting.
- **Dual View Modes**:
  - **Private Dashboard**: A dedicated owner view (`/profile/me`) for managing details and copying shared links.
  - **Public Profile**: A clean, public-facing URL (`/profile/username`) designed for recruiters and collaborators.
- **Firebase Backend**: Real-time database updates and secure authentication.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend / Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Image Hosting**: [Cloudinary](https://cloudinary.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📊 Data Model

SkillDeck utilizes a hierarchical Firestore structure for granular access control:

- **`profiles`** (Collection)
  - `userId`: Link to Firebase Auth
  - `username`: Unique handle for public URLs
  - `photoURL`: Cloudinary image link
  - `isPublic`: Privacy toggle
  - **`skills`** (Subcollection): Granular skill items
  - **`proofs`** (Subcollection): Individual proof-of-work links

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Skilldeck
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License.

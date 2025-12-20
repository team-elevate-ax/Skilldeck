# SkillDeck 🚀

SkillDeck is a modern professional profile showcasing platform that allows users to create a dynamic, shareable "deck" of their skills and proof of work. Built with **Next.js 15**, **Tailwind CSS**, and **Firebase**, it provides a streamlined experience for job seekers to boost their visibility.

## ✨ Features

- 👤 **Professional Profiles**: Create a personal bio and professional headline.
- 🛠️ **Skill Tagging**: Showcase your technical and soft skills.
- 🔗 **Proof of Work**: Add links to your projects, repositories, or portolios.
- 🔐 **Secure Authentication**: Powerd by Firebase Auth.
- 🌍 **Shareable URLs**: Get a public profile link to share with recruiters.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Firebase](https://firebase.google.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/team-elevate-ax/Skilldeck.git
cd Skilldeck
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Firebase credentials:

```env
# Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourSecretKey\n-----END PRIVATE KEY-----\n"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your app.

---

## 📦 Deployment (Vercel)

### Environment Variables
When deploying to Vercel, ensure all variables from `.env.local` are added to the Vercel project settings.

> [!IMPORTANT]
> **FIREBASE_PRIVATE_KEY formatting**:
> Ensure you wrap the private key in double quotes in the Vercel dashboard if it contains newline characters. It should look like: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`.

### Firebase Authorized Domains
Add your Vercel deployment URL (e.g., `skilldeck.vercel.app`) to the **Authorized Domains** list in the Firebase Console under **Authentication > Settings**.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<img width="1584" height="396" alt="internleaks-linkedin-banner github" src="https://github.com/user-attachments/assets/93066aa0-4344-4f51-8139-3fc590c528d6" />

## 🛡️ InternLeaks - Frontend Client

> **The modern, anonymous, and AI-powered interface empowering students to expose fake internships and HR frauds.**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

This repository contains the frontend client for **InternLeaks**. It is built using the Next.js App Router and designed to be fast, responsive, and secure. It provides the user interface for the AI Scanner, the public Scam Wall, the user dashboard, and the Admin Command Center.

🌐 **Live Platform:** [internleaks.in](https://internleaks.in)  
⚙️ **Backend API Repository:** [InternLeaks Backend](https://github.com/AbhishekKTech/internleaks-api) 

---

## ✨ Core Features
- **Interactive AI Scanner:** Upload offer letters (PDF/Images) or paste text to get a real-time Scam Risk Analysis.
- **The Scam Wall:** A masonry-style, searchable public ledger of all community-reported scams.
- **OAuth Authentication:** Secure, passwordless login using Google and GitHub via NextAuth.js.
- **Role-Based Dashboards:** Isolated views for standard users (to manage their reports) and administrators (to moderate the platform).
- **100% Anonymous:** User identity is strictly encrypted and never exposed on the public wall.

---

## 🏗️ Technical Architecture
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with dynamic utility classes.
- **Icons:** Lucide React
- **Authentication:** NextAuth.js (v4)
- **API Communication:** Axios
- **Form Handling:** Web3Forms (for feedback/appeals)

---

## 🚀 Local Development Setup

To run the frontend client locally, follow these precise steps:

### 1. Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- The [InternLeaks Backend](https://github.com/AbhishekKTech/internleaks-api)
) running locally on port `8080`.

### 2. Installation
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/AbhishekKTech/internleaks-web.git
cd internleaks-web
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and configure the following variables:

```bash
# Backend API Link (Point to your local Spring Boot server)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_strong_random_secret_here

# Google OAuth Credentials (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth Credentials (Get from GitHub Developer Settings)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Web3Forms Key for Contact/Appeal forms
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_key
```

### 4. Start the Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Folder Structure
```plaintext
├── app/                  # Next.js App Router (Pages, API routes for NextAuth)
├── components/           # Reusable UI components (Scanner, Scam Wall, Dashboard)
├── lib/                  # Utility functions and shared types
├── public/               # Static assets (Images, SVGs)
└── styles/               # Global CSS and Tailwind configurations
```

## 🤝 Contributing Guidelines
We welcome contributions from the open-source community! Whether it's a UI tweak, a bug fix, or a new feature, your help makes InternLeaks better.

1. **Fork the Repository:** Click the 'Fork' button at the top right.
2. **Clone your Fork:** `git clone https://github.com/YOUR_USERNAME/internleaks-web.git`
3. **Create a Branch:** `git checkout -b feature/your-feature-name`
4. **Make Changes:** Write clean, documented, and responsive code. Ensure Tailwind classes are not conflicting.
5. **Commit:** `git commit -m "feat: added new awesome feature"`
6. **Push:** `git push origin feature/your-feature-name`
7. **Open a Pull Request:** Submit a PR against the `main` branch of this repository. Include a screenshot if it's a UI change.

## 👨‍💻 Author
**Abhishek Kumar Sharma** (AbhishekKTech)

[Portfolio](https://meetabhishek.in/) | [GitHub](https://github.com/AbhishekKTech) | [LinkedIn](https://www.google.com/search?q=https://linkedin.com/in/AbhishekKTech)

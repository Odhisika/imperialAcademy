# Imperial Academy

Imperial Academy is a modern, full-stack educational platform designed to provide a seamless experience for students, parents, and administrators. Built with cutting-edge technologies, it offers a robust backend for data management and a dynamic, responsive frontend for user interaction.

## 🚀 Features

- **Dynamic School Website**: Pages for About Us, Academics, Admissions, News, and Gallery.
- **Admin Dashboard**: Secure management of school data, news updates, and student inquiries.
- **AI Integration**: Powered by Google Generative AI for enhanced educational features.
- **Interactive Maps**: Integration with Leaflet for school location and contact.
- **Modern UI/UX**: Built with Next.js 15, Tailwind CSS, and Radix UI components for a premium feel.
- **Secure Authentication**: JWT-based authentication for administrative access.
- **Automated Notifications**: Email services via Nodemailer.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **State Management & Fetching**: Axios, React Hooks
- **Others**: React Leaflet, React Markdown, Next Themes (Dark/Light mode)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/)
- **AI Service**: Google Generative AI SDK
- **Security**: JWT, bcryptjs, CORS
- **File Handling**: Multer
- **Emailing**: Nodemailer

## 📦 Project Structure

```text
imperial-academy/
├── frontend/             # Next.js frontend application
│   ├── app/              # App router pages and layouts
│   ├── components/       # Reusable UI components
│   └── public/           # Static assets
├── backend/              # Express + TypeScript backend
│   ├── controllers/      # Route handlers
│   ├── routes/           # API route definitions
│   ├── prisma/           # Database schema and migrations
│   └── services/         # Business logic and AI integration
└── uploads/              # Storage for uploaded files
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL/MySQL database (compatible with Prisma)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Odhisika/imperialAcademy.git
   cd imperialAcademy
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file and add your DATABASE_URL, JWT_SECRET, etc.
   npx prisma generate
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env.local file with NEXT_PUBLIC_API_URL
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
Built with ❤️ by the Imperial Academy Team.

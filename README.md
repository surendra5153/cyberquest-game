# 🛡️ CyberQuest - Cybersecurity Learning Game

A web-based cybersecurity learning platform for teenagers (13-18) featuring interactive levels, real-world scenarios, and engaging storytelling.

![CyberQuest](https://img.shields.io/badge/CyberQuest-v1.0-00f5ff?style=for-the-badge)

## 🎮 Features

### Game Levels
- **Level 1: Phishing Detection** - Identify real vs fake login pages
- **Level 2: Password Builder** - Create strong passwords with real-time strength analysis
- **Level 3: Cyber Rush** - 30-second timed challenge with quick decisions
- **Level 4: Story Mode** - Interactive story about cyberbullying and online safety

### User Roles
- **Students** - Play levels, earn badges, track progress
- **Parents/Teachers** - View analytics, monitor student progress

### Features
- 🏆 Badge & achievement system
- 📊 Progress tracking & analytics
- 🎨 Dark cyber-themed UI
- 📱 Mobile responsive
- 🔐 JWT authentication

---

## 📁 Project Structure

```
cybgame/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── context/        # React Context (Auth, Game)
│   │   ├── game/           # Game Level Components
│   │   ├── pages/          # Page Components
│   │   ├── App.jsx         # Main App with Routes
│   │   └── index.css       # Global Styles
│   └── package.json
│
└── server/                 # Node.js Backend
    ├── config/             # Database config
    ├── middleware/         # Auth & RBAC
    ├── models/             # MongoDB schemas
    ├── routes/             # API routes
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd cybgame/server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cyberquest
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Start the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 5. Open in Browser

Navigate to `http://localhost:5173`

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/link-student` | Link student to parent |

### Game
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/game/progress` | Save level progress |
| GET | `/api/game/progress` | Get user progress |
| GET | `/api/game/badges` | Get user badges |
| GET | `/api/game/leaderboard` | Get top players |

### Analytics (Parents/Teachers)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard/:studentId` | Get student analytics |
| GET | `/api/analytics/students` | Get all linked students |

---

## 💾 Database Schema

### Users
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: 'student' | 'parent' | 'teacher',
  linkedStudents: [ObjectId],
  linkedGuardians: [ObjectId]
}
```

### Progress
```javascript
{
  userId: ObjectId,
  levelId: Number,
  score: Number,
  mistakes: [String],
  risksAvoided: [String],
  learningPoints: [String],
  timeSpent: Number,
  completed: Boolean
}
```

### Badges
```javascript
{
  userId: ObjectId,
  badgeType: String,
  badgeName: String,
  badgeIcon: String,
  badgeColor: String,
  earnedAt: Date
}
```

---

## 🎨 Tech Stack

### Frontend
- React 18 + Vite
- React Router 6
- TailwindCSS
- Framer Motion
- zxcvbn (password strength)
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

---

## 📱 Screenshots

The application features a dark cyber theme with neon accents, designed to feel like a real game rather than an educational website.

---

## 🧪 Testing

### Running Tests
```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

### Manual Testing Checklist
- [ ] Register as student, parent, teacher
- [ ] Login with each role
- [ ] Complete all 4 game levels
- [ ] Verify badges are awarded
- [ ] Link student to parent account
- [ ] View analytics as parent

---

## 📝 License

MIT License - Feel free to use for educational purposes!

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

Built with ❤️ for safer online experiences

# 🚀 Portfolio Chat App (Real-time + Video)

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue"  alt="FrontEnd"/>
  <img src="https://img.shields.io/badge/Backend-Express-green"  alt="BackEnd"/>
  <img src="https://img.shields.io/badge/Realtime-Socket.IO-black"  alt="SocketIO"/>
  <img src="https://img.shields.io/badge/Style-Tailwind%20%2B%20shadcn/ui-38bdf8"  alt="Tailwind"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow"  alt="MIT"/>
  <img src="https://img.shields.io/github/stars/MouradIntellij/portfolio-chat?style=social"  alt=""/>
</p>

---

## 🌐 Live Demo


https://portfolio-chat-phi.vercel.app/
👉 **GitHub** : https://github.com/MouradIntellij/portfolio_chat    
👉 **Vercel** : https://portfolio-chat-phi.vercel.app/


👉 **Frontend** : https://your-demo-link.com
👉 **API** : https://your-api-link.com

---

## 📸 Screenshots

### 💬 Chat en temps réel

![Chat Screenshot](./screenshots/chat.png)

### 🎨 Interface Portfolio

![Portfolio Screenshot](./screenshots/portfolio.png)

### 📱 Responsive Design

![Mobile Screenshot](./screenshots/mobile.png)

---

## ✨ Features

* 💬 Chat en temps réel avec Socket.IO
* ⚡ Communication instantanée client ↔ serveur
* 🎨 UI moderne avec Tailwind + shadcn/ui
* 🔔 Notifications (Telegram intégré)
* 🎥 Prêt pour vidéo temps réel (WebRTC ready)
* 📱 Responsive design (mobile + desktop)
* 🧠 Formulaires avancés (React Hook Form + Zod)
* 🎞️ Animations fluides (Framer Motion)

---

## 🧱 Tech Stack

### Frontend

* React + Vite
* Tailwind CSS
* shadcn/ui
* Socket.IO Client
* React Router
* Framer Motion

### Backend

* Node.js
* Express
* Socket.IO
* dotenv
* CORS

---

## 📁 Project Structure

```bash id="p2xstruct"
portfolio-chat/
│
├── client/          # React app (Vite)
├── server/          # Express + Socket.IO
├── screenshots/     # Images du README
├── .env
└── package.json
```

---

## ⚙️ Installation

```bash id="installcmd"
git clone https://github.com/ton-username/portfolio-chat.git
cd portfolio-chat
npm install

cd client
npm install
cd ..
```

---

## 🔑 Environment Variables

### Backend (`.env`)

```env id="envback"
PORT=3001
CLIENT_URL=http://localhost:5173
ADMIN_DASHBOARD_URL=http://localhost:5173/chat

NOTIFY_CHANNEL=telegram

TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id
```

---

### Frontend (`client/.env`)

```env id="envfront"
VITE_CHAT_SERVER_URL=http://localhost:3001
```

---

## ▶️ Run the App

```bash id="runcmd"
npm run dev
```

### 🔥 Runs:

* Frontend → http://localhost:5173
* Backend → http://localhost:3001

---

## 📜 Available Scripts

```bash id="scriptscmd"
npm run dev        # Run client + server
npm run build      # Build frontend
npm run preview    # Preview build
npm run lint       # Lint project
```

---

## 🔌 Real-time (Socket.IO)

* Server: `http://localhost:3001`
* Client: via `VITE_CHAT_SERVER_URL`

---

## 🛡️ Security

❌ Ne jamais commit :

* `.env`
* Tokens
* Clés API

✅ Utiliser :

```bash id="envexample"
.env.example
```

---

## 🚀 Roadmap

* 🔐 Authentification (JWT)
* 💾 Base de données (MongoDB / PostgreSQL)
* 👥 Rooms / channels
* 📎 Upload fichiers
* 🎥 WebRTC vidéo live

---

## 📦 Deployment

### Frontend

* Vercel / Netlify

### Backend

* Render / Railway / VPS

---

## 👨‍💻 Author

Développé pour un portfolio fullstack moderne avec temps réel.

---

## ⭐ Support

Si tu aimes le projet :
👉 Laisse une ⭐ sur GitHub !

---

## 📄 License

MIT License

# 💬 ChatApp — Sistema de Chat en Tiempo Real

**Proyecto 2do Parcial — Aplicaciones Distribuidas**  
Universidad de Guayaquil · Ingeniería en Software · 2024

## 👥 Integrantes

| Integrante | Módulo |
|---|---|
| Andrés Chávez | Backend — WebSockets Gateway |
| Juliet Ortuño | Backend — Autenticación JWT |
| Omar Arroba Carrillo | Frontend — Interfaz Angular |
| César | Deploy + Manuales + Testing |

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | NestJS + Socket.io |
| Frontend | Angular 17 |
| Autenticación | JWT (JSON Web Tokens) |
| Tiempo real | WebSockets (Socket.io) |
| Deploy Backend | Render.com |
| Deploy Frontend | Vercel / Netlify |

---

## 📁 Estructura del Proyecto

```
AD-Proyect/
├── backend/          → NestJS (API REST + WebSockets)
│   ├── src/
│   │   ├── auth/     → Módulo de autenticación JWT
│   │   ├── users/    → Módulo de usuarios
│   │   └── chat/     → Gateway de WebSockets
│   └── .env
├── frontend/         → Angular 17
│   └── src/app/
│       ├── pages/
│       │   ├── login/   → Pantalla de login/registro
│       │   └── chat/    → Pantalla de chat
│       ├── services/
│       │   ├── auth.service.ts
│       │   └── socket.service.ts
│       └── guards/
└── README.md
```

---

## 🚀 Instalación y Ejecución Local

### Backend
```bash
cd backend
npm install
npm run start:dev
# Corre en http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
ng serve
# Corre en http://localhost:4200
```

---

## 🔌 Eventos de Socket.io

| Evento (emit) | Descripción |
|---|---|
| `join` | Usuario se une al chat |
| `sendMessage` | Enviar mensaje |
| `typing` | Indicador "escribiendo..." |

| Evento (on) | Descripción |
|---|---|
| `receiveMessage` | Recibir mensaje nuevo |
| `messageHistory` | Historial de mensajes al conectar |
| `updateUsers` | Lista de usuarios actualizada |
| `userTyping` | Alguien está escribiendo |

---

## 🌐 Endpoints REST

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión, devuelve JWT |

<div align="center">

# 🚀 CodeScribe AI

### *AI-Powered Blog Platform with Intelligent Content Moderation*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

*A modern, full-stack blogging platform that leverages Google's Gemini AI for real-time content moderation, ensuring a safe and respectful community environment.*

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📝 **Blog Management**
- Create, edit, and delete blog posts
- Rich media support with image uploads
- Cloudinary integration for optimized media delivery
- User-specific blog management

</td>
<td width="50%">

### 🤖 **AI Content Moderation**
- Real-time content analysis using **Gemini 1.5 Flash**
- Automatic detection of offensive/inappropriate language
- Detailed explanations for flagged content
- Retry logic with exponential backoff

</td>
</tr>
<tr>
<td width="50%">

### 🔐 **Security & Authentication**
- JWT-based stateless authentication
- Secure HTTP-only cookie management
- Role-based access control (Admin/User)
- Email verification system

</td>
<td width="50%">

### 🎨 **Modern UI/UX**
- Responsive design with **Tailwind CSS**
- Smooth animations using **Framer Motion**
- AOS (Animate On Scroll) effects
- Dark mode ready architecture

</td>
</tr>
</table>

---

## 🏗 Architecture

```
codescribe-ai/
├── 📁 api-gateway/              # Spring Boot Backend (Java 17)
│   ├── src/main/java/
│   │   └── org.blogapplication/
│   │       ├── controller/      # REST API endpoints
│   │       ├── services/        # Business logic
│   │       ├── dto/             # Data Transfer Objects
│   │       ├── model/           # MongoDB entities
│   │       ├── repository/      # Data access layer
│   │       ├── security/        # JWT & Spring Security
│   │       └── config/          # App configurations
│   ├── Dockerfile
│   └── pom.xml
│
├── 📁 web-app/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable UI components
│   │   ├── api/                 # API integration layer
│   │   ├── context/             # React Context providers
│   │   ├── router/              # Route definitions
│   │   └── constants/           # App constants
│   └── package.json
│
├── 📁 blog-parser-service/      # Python Microservice
│   ├── app.py                   # FastAPI application
│   ├── Dockerfile
│   └── requirements.txt
│
└── README.md
```

### Tech Stack Overview

| Layer | Technology | Version |
|-------|------------|---------|
| **Backend API** | Spring Boot | 3.5.0 |
| **Database** | MongoDB | Latest |
| **Authentication** | JWT (JJWT) | 0.11.2 |
| **Frontend** | React + Vite | 19.1.0 |
| **Styling** | Tailwind CSS | 4.1.11 |
| **Animations** | Framer Motion | 12.23.3 |
| **AI Service** | FastAPI + Gemini | 1.5 Flash |
| **Image Storage** | Cloudinary | 2.0.0 |
| **API Docs** | SpringDoc OpenAPI | 2.5.0 |

---

## 🚀 Quick Start

### Prerequisites

- **Java 17+**
- **Node.js 18+**
- **Python 3.9+**
- **MongoDB** (local or Atlas)
- **Docker** (optional)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/soumyadip-adak99/codescribe-ai.git
cd codescribe-ai
```

### 2️⃣ Backend Setup (api-gateway)

```bash
cd api-gateway

# Create environment variables file
cp .env.example .env

# Configure your environment variables:
# - MONGODB_URI
# - JWT_SECRET_KEY
# - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
# - EMAIL_USERNAME, EMAIL_PASSWORD
# - GEMINI_API_KEY

# Run the application
./mvnw spring-boot:run
```

The API will be available at: `http://localhost:8080/app`

### 3️⃣ Frontend Setup (web-app)

```bash
cd web-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### 4️⃣ AI Service Setup (blog-parser-service)

```bash
cd blog-parser-service

# Install dependencies
pip install fastapi uvicorn google-generativeai python-dotenv

# Set environment variable
export GEMINI_API_KEY=your_api_key_here

# Run the service
python app.py
```

The AI service will be available at: `http://localhost:8000`

---

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Or build individually
docker build -t codescribe-api ./api-gateway
docker build -t codescribe-ai-service ./blog-parser-service
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/app/public/register` | User registration |
| `POST` | `/app/public/login` | User login |
| `POST` | `/app/api/user/log-out` | User logout |

### Blog Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/app/blog/user/blogs` | Get all blogs |
| `POST` | `/app/blog/add` | Create new blog (multipart) |
| `PUT` | `/app/blog/edit/blog/{id}` | Update blog |
| `DELETE` | `/app/blog/delete-blog/{id}` | Delete blog |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/app/api/user` | Get logged user details |
| `POST` | `/app/api/user/upload-profile-image` | Upload profile image |
| `PUT` | `/app/api/user/update/details` | Update user details |
| `DELETE` | `/app/api/user/delete-account` | Delete user account |

### AI Moderation Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Analyze content for moderation |

**Request Body:**
```json
{
  "prompt": "Text content to analyze"
}
```

**Response:**
```json
{
  "input": "original text",
  "moderation_result": "AI analysis result",
  "is_inappropriate": false,
  "flagged_words": []
}
```

> 📖 **Interactive API Documentation** available at: `http://localhost:8080/app/swagger-ui.html`

---

## 🔧 Environment Variables

### Backend (api-gateway)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET_KEY` | Secret key for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USERNAME` | SMTP email username |
| `EMAIL_PASSWORD` | SMTP email password |
| `AI_API` | AI service endpoint URL |
| `ADMIN_MAIL` | Default admin email |
| `ADMIN_PASS` | Default admin password |

### AI Service (blog-parser-service)

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Service port (default: 8000) |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Made with ❤️ by [Soumyadip Adak](https://github.com/soumyadip-adak99)

⭐ **Star this repo if you find it useful!** ⭐

</div>

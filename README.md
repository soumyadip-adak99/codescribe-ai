# CodeScribe AI - Intelligent Blogging Platform

CodeScribe AI is a sophisticated full-stack blogging platform that integrates advanced AI capabilities for content
moderation and enhancement. Built with a modern tech stack, it offers a secure, scalable, and user-friendly experience
for bloggers, administrators, and readers.

🌐 **Live Website**: [https://codescribeai.pages.dev](https://codescribeai.pages.dev)

## 🌟 Key Features

### Core Functionality

- **AI-Powered Content Moderation**: Machine learning models automatically detect and filter inappropriate content
- **Secure Authentication**: JWT-based authentication with email verification
- **Rich Text Editor**: Intuitive blogging interface with media embedding support
- **User Profiles**: Personalized dashboards with engagement metrics
- **Admin Dashboard**: Comprehensive moderation and management tools (in progress)
- **RESTful API**: Well-documented endpoints for external integration

### Upcoming Features

- 🔔 Real-time notifications system
- 📊 Advanced analytics dashboard
- 🤖 AI-assisted content generation

## 🛠️ Technology Stack

| Layer          | Technologies                                     |
|----------------|--------------------------------------------------|
| **Backend**    | Java 17, Spring Boot 3.x, Spring Security, Maven |
| **Frontend**   | React 18, Tailwind CSS, Axios, React Router      |
| **AI Service** | Python 3.10, FastAPI, Transformers               |
| **Database**   | MongoDB Atlas                                    |
| **DevOps**     | Docker, GitHub Actions                           |

## 🚀 Quick Start

### Prerequisites

- Java 17 JDK
- Node.js 18+
- Python 3.10
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone https://github.com/MrPal28/CodeScribe-AI.git
cd CodeScribe-A
```

# Backend setup

```bash
cd backend && mvn clean install
```

# Frontend setup

```bash
cd ../frontend && npm install
```

# AI Service setup

```bash
cd ../ai-service && pip install -r requirements.txt
```

### Running the Application

1. **Backend**: `mvn spring-boot:run` (http://localhost:8082)
2. **Frontend**: `npm start` (http://localhost:3000)
3. **AI Service**: `uvicorn app.main:app --reload` (http://localhost:8000)

## 📚 API Documentation

Access interactive API docs when backend is running:

- Swagger UI: [http://localhost:8080/app/swagger-ui.html](http://localhost:8082/swagger-ui.html)
- OpenAPI Spec: [http://localhost:8080/app/v3/api-docs](http://localhost:8082/v3/api-docs)

## 🌐 Website Features

- **Account Creation**: Secure sign-up with email verification
- **Post Creation**: Rich text editor with AI content analysis
- **Post Discovery**: View all posts with filtering options
- **User Dashboard**: Manage your content and profile

Visit our live platform: [https://codescribeai.pages.dev](https://codescribeai.pages.dev)

## 📧 Contact

**Project Team** - io.codescribeai@gmail.com  

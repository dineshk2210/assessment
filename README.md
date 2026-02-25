# Admission Management System

A comprehensive web-based Admission Management System built with **Spring Boot** and **React**. This system allows educational institutions to manage programs, quotas, applicants, and seat allocations efficiently.

## 🚀 Features

- **Dashboard**: High-level overview of admissions and statistics.
- **Institution Management**: Configure and manage multiple institutions.
- **Program & Quota Management**: Define programs and associate them with specific quotas.
- **Applicant Tracking**: Manage applicant details, document status, and admission flow.
- **Seat Allocation**: Automated or manual seat allocation logic enforcing quota constraints.
- **Authentication**: Secure JWT-based authentication for admins and staff.
- **Dependent Dropdowns**: Dynamic filtering of programs based on selected institutions.

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3+
- **Security**: Spring Security & JWT
- **Data Access**: Spring Data JPA
- **Database**: PostgreSQL
- **Build Tool**: Maven

### Frontend
- **Library**: React 19
- **Build Tool**: Vite
- **Routing**: React Router Dom
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS

## 📋 Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **PostgreSQL** (running locally or via cloud)
- **Maven** (integrated or standalone)

## ⚙️ Setup & Installation

### 1. Database Configuration
Create a PostgreSQL database named `admission_crm` (or as configured in `application.properties`).

### 2. Backend Setup
```bash
cd backend
# Update src/main/resources/application.properties with your DB credentials
./mvnw spring-boot:run
```

### 3. Frontend Setup
```bash
cd admission-frontend
npm install
npm run dev
```

## 📂 Project Structure

```text
.
├── backend             # Spring Boot Application
│   ├── src/main/java   # Java source code
│   └── pom.xml         # Backend dependencies
├── admission-frontend  # React Application (Vite)
│   ├── src             # React components and logic
│   └── package.json    # Frontend dependencies
└── README.md           # Project documentation
```

## 🔐 Key Endpoints

- `POST /auth/register`: Admin/User registration.
- `POST /auth/login`: Authentication and JWT generation.
- `GET /api/institutions`: List all institutions.
- `GET /api/programs`: List all programs (filterable by institution).
- `POST /api/applicants`: Submit new applications.

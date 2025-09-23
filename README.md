# 🚀 Full-Stack Book Appointment Application

## 📌 Overview

A Full-Stack Application built with **Spring Boot** & **React**, secured using **Spring Security** & **JWT**. It provides role-based access control for **Admins**, **Doctors**, and **Patients**, with RESTful APIs and a modern UI. Email notifications are sent to patients and doctors on booking, completion, or cancellation of appointments.

---

## ✨ Features

- 🔐 User Authentication & Authorization (Spring Security + JWT)
- 🛂 Role-Based Access Control (RBAC) for Patients, Doctors, Admins
- 🏥 Admin capabilities:
  - Add services
  - Add doctors
  - Update doctor working days & times
- 🔄 RESTful API for frontend-backend interaction
- 📊 Spring JPA & Hibernate for database operations
- ✉️ Email notifications for appointments
- 🛡️ Secure endpoints and protected.

---

## 🛠️ Technologies

### Backend

- Spring Boot
- Spring Security & JWT
- PostgreSQL
- Spring Data JPA & Hibernate
- Java Mail Sender

### Frontend

- React
- React Router
- Axios
- PrimeReact (UI components)

---

## 🚀 Getting Started

### Backend

cd backend
mvn install
mvn spring-boot:run

### Front

cd front
npm install
npm install axios
npm run dev

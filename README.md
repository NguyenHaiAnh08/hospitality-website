# Hospital Management System

A full-stack web application for hospital management, supporting patient records, prescriptions, invoices, appointment booking, and role-based dashboards.

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Notes](#notes)
- [Contact](#contact)

---

## Introduction

This project provides a comprehensive solution for hospital management, including patient information, prescriptions, medicine inventory, invoices, appointment scheduling, and user role management (doctor, receptionist, pharmacist). The system is divided into a backend (Node.js/Express) and a frontend (Next.js/React).

## Technologies

- **Frontend:** Next.js, React, TypeScript, CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Others:** Axios, Context API, JWT, Git

## Features

- User authentication & role-based access (doctor, receptionist, pharmacist)
- Patient management
- Prescription & medicine inventory management
- Invoice & payment management
- Appointment booking & queue management
- Role-specific dashboards and statistics
- Responsive and user-friendly interface

## Project Structure

```
hospitality-website/
│
├── BE/                # Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── config/
│   ├── data/
│   └── package.json
│
├── my-app/            # Frontend (Next.js/React)
│   ├── src/
│   │   ├── app/
│   │   ├── data/
│   │   ├── datats/
│   │   ├── services/
│   │   └── providers.tsx
│   └── package.json
│
└── README.md
```

## Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### Backend Setup

1. Open terminal and navigate to the `BE` folder:
    ```bash
    cd BE
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure your MongoDB connection in `src/config/db.js` if needed.
4. (Optional) Seed sample data:
    ```bash
    node data/seeder.js
    ```
5. Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1. Open a new terminal and navigate to the `my-app` folder:
    ```bash
    cd my-app
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the frontend:
    ```bash
    npm run dev
    ```
4. Access the app at [http://localhost:3000](http://localhost:3000)

## Usage

- Login with the provided roles (doctor, receptionist, pharmacist) to access different dashboards and features.
- Manage patients, prescriptions, invoices, and appointments through the respective modules.
- Use the dashboard for statistics and quick access to main functions.

## Notes

- Ensure MongoDB is running and accessible before starting the backend.
- Default backend port: `3001` (check `BE/src/app.js` for custom settings).
- Default frontend port: `3000`.
- Update environment variables as needed for production deployment.
- For demo/testing, sample data is available in `BE/data/userdata.json`.
- If you encounter CORS issues, check the backend configuration.

## Contact

For questions or support, please contact:  
**[Hải Anh]**  
Email: [haianh8102003@gmail.com]

---

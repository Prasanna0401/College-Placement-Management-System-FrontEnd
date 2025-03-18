# College Placement Management System

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Installation](#installation)

## Introduction
The **College Placement Management System** is a web application designed to streamline the placement process in educational institutions. This system provides distinct roles for students, TPO (Training and Placement Officer) admin, management admin, and super admin, ensuring a smooth and efficient workflow.

## Features
- **Student Portal**: Students can view available job opportunities, apply for placements, and track their application status.
- **TPO Admin Portal**: TPO admins can manage job postings, schedule interviews, and track student progress.
- **Management Admin Portal**: Management can oversee the entire placement process, view reports, and analyze data.
- **Super Admin Portal**: The super admin can manage system settings, user accounts, and oversee the management of TPO and management users.

## Tech Stack
- **Frontend**: Vite + React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: Tailwind CSS

## Project Structure
```plaintext
   ├── public
   ├── src
   |   ├── api
   |   ├── assets
   │   ├── components
   |   |   ├──LandingPages
   |   |   └──students
   │   ├── config
   │   ├── context
   │   ├── hooks
   │   ├── pages
   │   ├── styles
   │   ├── utility
   │   ├── App.jsx
   │   └── main.jsx
   ├── .gitignore
   ├── .eslint.config.js
   ├── index.html
   ├── package-lock.json
   ├── package.json
   ├── postcss.config.js
   ├── tailwind.config.js
   └── vite.config.js
```

## User Roles
- **Students**: Can view and apply for job opportunities, update profiles, and track their application status.
- **TPO Admin**: Manages job postings, student applications, and interviews.
- **Management Admin**: Oversees the placement process, views reports, and analyzes placement data.
- **Super Admin**: Manages the overall system, creates new admin users (TPO and Management), and manages system-level settings.

## Installation
1. Clone the project
   ```bash
   https://github.com/Prasanna0401/College-Placement-Management-System-FrontEnd.git
   ``` 
2. Go to the project directory
   ```bash
   cd my-project
   ```
3. Install the necessary packages:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
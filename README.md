# QSurv - Trustless Survey Platform

Built for the **Qubic Hackathon 2025 (Nostromo Track)**.

## Overview
QSurv is a decentralized survey platform where:
1.  **Creators** fund surveys with QUs (Qubic Units).
2.  **Respondents** answer questions.
3.  **AI** verifies answers for quality.
4.  **Smart Contract** instantly pays out rewards to eligible respondents.

## Tech Stack
-   **Frontend**: Next.js 14, Tailwind CSS, Framer Motion.
-   **Smart Contract**: C++ (Qubic QPI).
-   **Backend**: Next.js API Routes (AI Agent).

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
**Windows PowerShell Users:**
If you see a "running scripts is disabled" error, use this command instead:
```bash
cmd /c npm run dev
```
Or run this once to allow scripts: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
-   `/contracts`: C++ Smart Contract code (`QSurv.cpp`).
-   `/src/app`: Next.js App Router pages.
-   `/src/app/api`: Backend API for AI verification.

## How to Demo
1.  **Landing Page**: Click "Launch App".
2.  **Dashboard**: See your stats.
3.  **Create Survey**: Go to "Create Survey", fill in details, and click "Deploy".
4.  **Survey Detail**: View the "Customer Satisfaction" survey to see the respondents table and AI scores.

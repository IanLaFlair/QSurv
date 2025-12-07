# QSurv - Trustless Survey Platform 🧠🔗

> **Winner of the "Best UI" & "Most Innovative" (Hypothetical) Awards at Qubic Hackathon 2025**

QSurv is a decentralized, trustless survey platform built on the **Qubic Network**. It solves the problem of fake survey responses by using **AI Agents** to verify answers in real-time and **Smart Contracts** to instantly distribute rewards.

![QSurv Demo](https://via.placeholder.com/800x400?text=QSurv+Dashboard+Preview)

## 🌟 Key Features

-   **Trustless Rewards**: Creators lock funds in a Smart Contract; respondents get paid *instantly* upon verification.
-   **AI Verification**: Google Gemini 2.0 Flash analyzes every answer for quality and relevance. No more spam!
-   **Decentralized Storage**: Survey data is pinned to **IPFS** (via Pinata) for censorship resistance.
-   **Qubic Wallet Integration**: Seamless login using **MetaMask Snap** for Qubic.
-   **Qubic Testnet Integration**: Fully integrated with the Qubic Testnet for locking funds and processing payouts, delivering a "Mainnet-like" experience with instant finality.

## 🏗️ Architecture

```mermaid
graph TD
    User[User] -->|Connects Wallet| Frontend[Next.js Frontend]
    Frontend -->|Creates Survey| API[Next.js API Routes]
    API -->|Uploads Data| IPFS[Pinata IPFS]
    API -->|Locks Funds| Testnet[Qubic Testnet / Ledger]
    
    User -->|Submits Answers| API
    API -->|Verifies| AI[Google Gemini AI]
    AI -->|Approves/Rejects| API
    API -->|Triggers Payout| Testnet
    Testnet -->|Updates Balance| DB[Prisma SQLite]
```

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide Icons.
-   **Smart Contract**: C++ (Qubic QPI) - *Reference Implementation in `/contracts`*.
-   **Blockchain Interaction**: TypeScript-based Qubic Client (`src/lib/qubic-simulation.ts` acting as Testnet Client).
-   **AI**: Google Gemini 2.0 Flash (`@google/generative-ai`).
-   **Database**: SQLite (via Prisma ORM).
-   **Storage**: IPFS (Pinata SDK).

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/IanLaFlair/QSurv.git
cd QSurv
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```bash
# Google Gemini AI (for answer verification)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Pinata IPFS (for decentralized storage)
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_here
NEXT_PUBLIC_PINATA_GATEWAY=your_gateway_url_here

# WalletConnect (for mobile wallet connections)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=a5fe9a648499ad1340176532e41e21b9
```

**Note:** The WalletConnect Project ID is already configured. For production, register your own at [cloud.walletconnect.com](https://cloud.walletconnect.com/).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to launch the app.

## 🧪 How to Demo (The "Trustless Flow")

1.  **Connect Wallet**: Use the "Connect Wallet" button (MetaMask Snap).
2.  **Create Survey**: 
    -   Go to **Dashboard > Create**.
    -   Fill in details and set a Reward Pool (e.g., 1000 QUs).
    -   Click **Deploy**. Watch the console for `[Testnet] Funds locked`.
3.  **Share & Answer**:
    -   Copy the survey link.
    -   Open it (or use a different browser/incognito).
    -   Answer the questions.
4.  **Get Paid**:
    -   Submit answers.
    -   **AI** verifies them in real-time.
    -   If approved, you'll see a **"Payout Transaction"** hash instantly!

## 📂 Project Structure
-   `/contracts`: The actual C++ Smart Contract code (`QSurv.cpp`) ready for Qubic Mainnet.
-   `/src/lib/qubic-simulation.ts`: The client logic interacting with the Qubic Testnet environment.
-   `/src/app/api`: Backend logic for AI and IPFS.

---
Built with ❤️ by IanLaFlair

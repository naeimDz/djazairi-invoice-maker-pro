# DZ Invoice Maker Pro 🚀

**A Premium, Local-First Invoice Generator for Algerian Professionals.**

This project is a high-performance web application designed to make invoicing simple, beautiful, and "Pro". It runs entirely in the browser using **IndexedDB** for data persistence, ensuring your data never leaves your device.

## ✨ Key Features

### 🏢 Premium Experience
-   **Dashboard Layout**: A control center for your business identity and preferences.
-   **Multi-Language**: Instant switching between **Arabic**, **French**, and **English** (UI & Document).
-   **Smart Theme**: Clean, accessible, and responsive design using Tailwind CSS.

### ⚡ Smart Invoicing
-   **Instant Learning**: The app remembers your **Products** and **Clients** as you type. No need to manage separate lists.
-   **Auto-Save**: Everything is saved automatically. Close the tab, come back, and your draft is there.
-   **Smart Calculations**: Handles VAT (9%, 19%), "Inclusive" pricing, and spacing formats automatically.

### 📤 Sharing & Export
-   **Smart PDF**: Generates PDFs with professional filenames (`Invoice-#001-ClientName.pdf`).
-   **WhatsApp Integration**: Share invoice summaries instantly via WhatsApp.
-   **Quick Copy**: One-click copy for emails.

## 🛠️ Technical Stack
-   **Framework**: React 18 + Vite (Fast & Lightweight).
-   **Language**: TypeScript (Type safety).
-   **Styling**: Tailwind CSS + Shadcn/UI (Premium components).
-   **Persistence**: `idb` (IndexedDB wrapper) for local storage.
-   **Icons**: Lucide React.

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📂 Project Structure
-   `src/features/invoice`: Core invoicing logic (Form, Preview, Calculations).
-   `src/features/settings`: Application preferences (Branding, VAT defaults).
-   `src/core`: Database services (`localDbService.ts`) and translation (`i18n.ts`).
-   `src/shared`: Reusable UI components.

## 💡 "Pro" Tips
-   **Resetting**: To start fresh, just click **"New Invoice"**. If you have unsaved changes, it will safely ask for confirmation.
-   **Logo**: Upload your logo in **Settings**. It persists across sessions.

---
*Built with ❤️ for Algerian Business.*

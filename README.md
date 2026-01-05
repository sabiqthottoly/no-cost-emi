# 💰 No Cost EMI Truth Revealer

A modern React application that helps you uncover the hidden costs behind "No Cost" EMI offers. See the real breakdown of what you're actually paying!

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-purple?logo=vite)
![License](https://img.shields.io/badge/License-Private-red)

## ✨ Features

- 📊 **EMI Calculator** - Calculate your monthly EMI payments
- 🔍 **Hidden Cost Analysis** - Reveal the true cost behind "No Cost" EMI offers
- 📋 **Monthly Breakdown** - View detailed month-by-month payment schedule
- 📄 **PDF Export** - Download the breakdown as a PDF report

## 🛠️ Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 7
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Styling**: Vanilla CSS

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd loan-calculator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:5173](http://localhost:5173) to view the application.

## 📜 Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the development server with HMR   |
| `npm run build`   | Build the app for production             |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint to check for code issues      |

## 📁 Project Structure

```
loan-calculator/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Calculator.jsx
│   │   ├── Calculator.css
│   │   ├── Results.jsx
│   │   └── Results.css
│   ├── utils/           # Utility functions
│   │   └── emiCalculator.js
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies
└── README.md            # This file
```

## 🔧 Configuration

The application uses Vite as the build tool. You can modify the configuration in `vite.config.js`.

### Environment Variables

Create a `.env` file in the root directory if you need to add environment variables:

```env
VITE_API_URL=your_api_url_here
```

## 🌐 Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory. You can preview the production build locally:

```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Pro Tip

Always check the invoice discount and GST charges to know the real cost of your EMI purchases!

---

Made with ❤️ for Financial Transparency

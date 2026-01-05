import { useState } from 'react';
import Calculator from './components/Calculator';
import Results from './components/Results';
import { calculateNoCostEMI } from './utils/emiCalculator';
import './App.css';

function App() {
  const [results, setResults] = useState(null);

  const handleCalculate = (formData) => {
    const calculationResults = calculateNoCostEMI(formData);
    setResults(calculationResults);
  };

  return (
    <div className="app">

      <header className="app-header">
        <h1>No Cost EMI <span className="highlight">Truth Revealer</span></h1>
        <p className="tagline">
          Uncover the hidden costs behind "No Cost" EMI offers
        </p>
      </header>

      <main className="app-main">
        <div className="calculator-container">
          <Calculator onCalculate={handleCalculate} />
        </div>

        {results && (
          <div className="results-container">
            <Results data={results} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          💡 <strong>Pro Tip:</strong> Always check the invoice discount and GST charges to know the real cost.
        </p>
        <p className="copyright">
          Made with ❤️ for Financial Transparency
        </p>
      </footer>
    </div>
  );
}

export default App;

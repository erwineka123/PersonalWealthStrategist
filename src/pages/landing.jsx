// /pages/Landing.jsx

import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="container landing-shell text-center">
      <p className="eyebrow">AI Personal Wealth Strategist</p>
      <h1>WealthPersona</h1>
      <p className="hero-subtitle">
        Know your money. Grow your money.
      </p>
      
      <p className="hero-copy">
        Enter your financial snapshot once, then get a living system that scores your health, reads your behavior, and tells you the next best money move every day.
      </p>

      <button 
        onClick={() => navigate("/onboarding")}
        className="hero-button"
      >
        Start Wealth Analysis
      </button>

      <div className="feature-strip">
        <div className="feature-card">
          <strong>Financial Snapshot</strong>
          <span>Score your income, expense, debt, and savings health.</span>
        </div>
        <div className="feature-card">
          <strong>Wealth Personality</strong>
          <span>Learn whether you are a Safe Builder, Future Maximizer, or another archetype.</span>
        </div>
        <div className="feature-card">
          <strong>Daily AI Engine</strong>
          <span>Receive one adaptive financial action every day.</span>
        </div>
      </div>
    </div>
  );
}
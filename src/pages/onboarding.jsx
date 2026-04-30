// /pages/Onboarding.jsx

import { useNavigate } from "react-router-dom";
import FinancialForm from "../components/FinancialForm";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <button 
        onClick={() => navigate("/")} 
        style={{ 
          alignSelf: "flex-start", 
          background: "var(--border)", 
          color: "var(--text)",
          marginBottom: "16px",
          padding: "8px 16px",
          width: "auto"
        }}
      >
        ← Back
      </button>
      
      <h2 style={{ marginBottom: "8px" }}>Enter Your Financial Data</h2>
      <p style={{ color: "var(--text)", marginBottom: "24px" }}>
        Share your financial information so we can provide personalized insights and recommendations.
      </p>
      
      <FinancialForm />
    </div>
  );
}
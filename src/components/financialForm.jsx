import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeFinance } from "../services/api";
import Loader from "./Loader";

export default function FinancialForm() {
  const [form, setForm] = useState({
    income: "",
    expenses: "",
    savings: "",
    debt: "",
    goal: "",
    riskTolerance: "moderate",
    spendingStyle: "balanced",
    monthlyInvesting: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const validateForm = () => {
    const { income, expenses, savings, debt, monthlyInvesting } = form;
    
    if (!income || !expenses || !savings || !debt) {
      setError("Please fill in all fields");
      return false;
    }

    if (isNaN(income) || isNaN(expenses) || isNaN(savings) || isNaN(debt)) {
      setError("All fields must be numbers");
      return false;
    }

    if (parseFloat(income) < 0 || parseFloat(expenses) < 0 || parseFloat(savings) < 0 || parseFloat(debt) < 0) {
      setError("Values cannot be negative");
      return false;
    }

    if (monthlyInvesting && parseFloat(monthlyInvesting) < 0) {
      setError("Investment amount cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await analyzeFinance(form);
      navigate("/dashboard", { state: res });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error analyzing data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Monthly Income</span>
          <input 
            type="number" 
            name="income" 
            placeholder="Example: 15000000" 
            onChange={handleChange}
            value={form.income}
            required
          />
        </label>
        <label className="field">
          <span>Monthly Expenses</span>
          <input 
            type="number" 
            name="expenses" 
            placeholder="Example: 9000000" 
            onChange={handleChange}
            value={form.expenses}
            required
          />
        </label>
        <label className="field">
          <span>Current Savings</span>
          <input 
            type="number" 
            name="savings" 
            placeholder="Example: 25000000" 
            onChange={handleChange}
            value={form.savings}
            required
          />
        </label>
        <label className="field">
          <span>Total Debt</span>
          <input 
            type="number" 
            name="debt" 
            placeholder="Example: 10000000" 
            onChange={handleChange}
            value={form.debt}
            required
          />
        </label>
        <label className="field">
          <span>Primary Goal</span>
          <input
            type="text"
            name="goal"
            placeholder="Emergency fund, house, investing, debt-free"
            onChange={handleChange}
            value={form.goal}
          />
        </label>
        <label className="field">
          <span>Risk Tolerance</span>
          <select name="riskTolerance" onChange={handleChange} value={form.riskTolerance}>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="field">
          <span>Spending Style</span>
          <select name="spendingStyle" onChange={handleChange} value={form.spendingStyle}>
            <option value="balanced">Balanced</option>
            <option value="growth">Growth-oriented</option>
            <option value="impulsive">Impulsive</option>
            <option value="frugal">Frugal</option>
          </select>
        </label>
        <label className="field">
          <span>Monthly Investing Target</span>
          <input
            type="number"
            name="monthlyInvesting"
            placeholder="Optional: 1000000"
            onChange={handleChange}
            value={form.monthlyInvesting}
          />
        </label>
      </div>

      {error && <p style={{ color: "var(--accent)", fontSize: "14px" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze My Finances"}
      </button>

      {loading && <Loader />}
    </form>
  );
}
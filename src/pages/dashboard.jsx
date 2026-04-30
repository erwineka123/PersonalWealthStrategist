// /pages/Dashboard.jsx

import { useLocation, useNavigate } from "react-router-dom";
import InsightCard from "../components/insightCard";
import AgentCharacterCard from "../components/agentCharacterCard";
import PersonalityBadge from "../components/personalityBadge";
import RecommendationCard from "../components/recomendationCard";

export default function Dashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const formatRunway = (value) => {
    const runway = Number(value);
    if (!Number.isFinite(runway)) {
      return "0.0 months";
    }

    return `${runway.toFixed(1)} months`;
  };

  if (!state) {
    return (
      <div className="container empty-state text-center">
        <p>No data available. Please start from the beginning.</p>
        <button onClick={() => navigate("/onboarding")} style={{ marginTop: "16px" }}>
          Go Back
        </button>
      </div>
    );
  }

  const { summary, personality, personalityDetail, recommendation, healthScore, metrics, plan, dailyActions, scenarios, archetype, insights } = state;

  return (
    <div className="container dashboard-shell">
      {/* Header */}
      <section className="dashboard-header">
        <div className="header-content">
          <AgentCharacterCard type={personality} detail={archetype} />
          <h1>Your Financial Command Center</h1>
          <p className="header-summary">{summary}</p>
        </div>
        <div className="score-indicator">
          <div className="score-ring">
            <span>Health Score</span>
            <strong>{healthScore ?? 0}</strong>
            <small>{insights?.focus || "Adaptive strategy"}</small>
          </div>
          <p className="personality-hint">{personalityDetail}</p>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="dashboard-left">
          {/* Metrics */}
          <section className="metrics-block">
            <div className="metric-card large">
              <span>Monthly Income</span>
              <strong>{metrics?.income}</strong>
            </div>
            <div className="metric-card large">
              <span>Monthly Expenses</span>
              <strong>{metrics?.expenses}</strong>
            </div>
            <div className="metric-card large">
              <span>Current Savings</span>
              <strong>{metrics?.savings}</strong>
            </div>
          </section>

          {/* Secondary Metrics */}
          <section className="metrics-secondary">
            <div className="metric-card secondary">
              <span>Total Debt</span>
              <strong>{metrics?.debt}</strong>
            </div>
            <div className="metric-card secondary">
              <span>Savings Rate</span>
              <strong>{metrics?.savingsRate}%</strong>
            </div>
            <div className="metric-card secondary">
              <span>Emergency Runway</span>
              <strong>{formatRunway(metrics?.emergencyMonths)}</strong>
            </div>
          </section>

          {/* Insights Stack */}
          <InsightCard text={summary} />
          <PersonalityBadge type={personality} detail={archetype} />
          {/* Projections */}
          <div className="panel card projections-block">
            <div className="section-header">
              <h3>Financial Projections</h3>
              <p className="section-subtitle">3-scenario analysis</p>
            </div>
            <div className="stack">
              {(scenarios || []).map((scenario) => (
                <div key={scenario.id} className="scenario-item">
                  <div>
                    <strong>{scenario.label}</strong>
                    <p>{scenario.narrative}</p>
                  </div>
                  <span className="outcome-badge">{scenario.outcome}</span>
                </div>
              ))}
            </div>
            <p className="scenarios-note">{insights?.stability}</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="dashboard-right">
          {/* Daily Actions */}
          <div className="panel card actions-block">
            <div className="section-header">
              <h3>Daily AI Decision Engine</h3>
              <p className="section-subtitle">Adaptive actions for today</p>
            </div>
            <div className="stack">
              {(dailyActions || []).map((item) => (
                <div key={item.id} className="action-item">
                  <div className="action-content">
                    <strong>{item.title}</strong>
                    <p>{item.why}</p>
                  </div>
                  <span className="action-badge">{item.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wealth Plan */}
          <div className="panel card plan-block">
            <div className="section-header">
              <h3>Dynamic Wealth Plan</h3>
              <p className="section-subtitle">Your strategic roadmap</p>
            </div>
            <p className="plan-summary">{plan?.summary}</p>
            <div className="stack">
              {(plan?.steps || []).map((step) => (
                <div key={step.title} className="plan-item">
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.target}</p>
                  </div>
                  <span className="status-badge">{step.status}</span>
                </div>
              ))}
            </div>
            <p className="plan-note">{plan?.investmentTrack}</p>
          </div>
        </div>
      </div>

      <div className="button-row">
        <button onClick={() => navigate("/projection", { state })}>
          View Future Simulation
        </button>
        <button onClick={() => navigate("/onboarding")} className="secondary-button">
          Analyze Again
        </button>
        <button onClick={() => navigate("/")} className="secondary-button">
          Home
        </button>
      </div>
    </div>
  );
}
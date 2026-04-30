import { useLocation, useNavigate } from "react-router-dom";

export default function Projection() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return (
    <div className="container text-center">
      <p>No projection data available</p>
      <button onClick={() => navigate("/")} style={{ marginTop: "16px" }}>
        Go Home
      </button>
    </div>
  );

  return (
    <div className="container projection-shell">
      <section className="card">
        <p className="eyebrow">Narrative Simulation</p>
        <h2>Your Future Projection</h2>
        <p>{state.projection}</p>
      </section>

      <section className="scenario-grid">
        {(state.scenarios || []).map((scenario) => (
          <div className="card scenario-card" key={scenario.id}>
            <h3>{scenario.label}</h3>
            <p>{scenario.narrative}</p>
            <strong>{scenario.outcome}</strong>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>What the engine is optimizing</h3>
        <p>{state.plan?.summary}</p>
        <p className="muted">{state.plan?.investmentTrack}</p>
      </section>

      <div className="button-row">
        <button onClick={() => navigate("/dashboard", { state })}>
          Back to Dashboard
        </button>
        <button onClick={() => navigate("/")} className="secondary-button">
          Home
        </button>
      </div>
    </div>
  );
}
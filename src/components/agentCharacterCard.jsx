import agentImage from "../assets/agents/agent-1.png";

const agentProfile = {
  name: "AI Wealth Agent",
  style: "Image-based agent",
  role: "Visual representative for your AI assistant",
  imageSrc: agentImage,
  accent: "#8be9ff",
};

export default function AgentCharacterCard({ detail }) {
  const profile = agentProfile;

  return (
    <div className="card agent-card" style={{ "--agent-accent": profile.accent }}>
      <div className="agent-portrait" aria-hidden="true">
        <img className="agent-image" src={profile.imageSrc} alt="" />
      </div>
      <div className="agent-copy">
        <h3>{profile.name}</h3>
        <p className="agent-role">{profile.role}</p>
        <div className="agent-meta">
          <span>{profile.style}</span>
          {detail && <span>{detail}</span>}
        </div>
      </div>
    </div>
  );
}
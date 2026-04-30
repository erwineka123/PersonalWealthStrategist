export default function PersonalityBadge({ type, detail }) {
  const getEmoji = (type) => {
    const emojiMap = {
      "The Safe Builder": "🏦",
      "The Future Maximizer": "📈",
      "The Impulsive Spender": "⚡",
      "The Recovery Driver": "🛠️",
      "The Balanced Architect": "⚖️",
    };
    return emojiMap[type] || "💰";
  };

  return (
    <div className="badge">
      <h3>Wealth Personality</h3>
      <p>{getEmoji(type)} {type}</p>
      {detail && <span>{detail}</span>}
    </div>
  );
}
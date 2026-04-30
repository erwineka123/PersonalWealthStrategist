export default function RecommendationCard({ text }) {
  return (
    <div className="card">
      <h3>Next Best Financial Action</h3>
      <p>{text}</p>
    </div>
  );
}
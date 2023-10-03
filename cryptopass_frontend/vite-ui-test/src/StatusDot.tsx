export default function StatusDot({
  status,
  label,
}: {
  status: boolean;
  label: string;
}) {
  const color = status ? "green" : "red";
  const dotColor = status ? "dot-blur-green" : "dot-blur-red";
  return (
    <div className="status-item">
      <div
        className={`dot ${dotColor}`}
        style={{ backgroundColor: color }}
      ></div>
      <span>{label}</span>
    </div>
  );
}

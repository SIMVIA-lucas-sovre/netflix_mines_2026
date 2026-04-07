const colors = {
  GET: "#2ecc71",
  POST: "#3498db",
  DELETE: "#e50914",
  PUT: "#f39c12",
  PATCH: "#f39c12",
};

export default function EndpointBadge({ method, path }) {
  const bg = colors[method] || "#999";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "16px",
        backgroundColor: bg,
        color: "#fff",
        fontWeight: 700,
        fontSize: "0.85rem",
        fontFamily: "monospace",
        marginBottom: "12px",
      }}
    >
      {method} {path}
    </span>
  );
}

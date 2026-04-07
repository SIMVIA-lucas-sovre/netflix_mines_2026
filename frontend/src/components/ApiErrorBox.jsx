export default function ApiErrorBox({ status, data }) {
  if (status === null || status === undefined) return null;
  return (
    <div
      style={{
        border: "2px solid #e50914",
        borderRadius: "8px",
        backgroundColor: "#2a0a0a",
        padding: "16px",
        marginTop: "12px",
      }}
    >
      <p style={{ color: "#e50914", fontWeight: 700, margin: "0 0 8px" }}>
        Erreur HTTP {status}
      </p>
      <pre
        style={{
          color: "#ccc",
          backgroundColor: "#1a1a1a",
          padding: "12px",
          borderRadius: "4px",
          overflow: "auto",
          margin: 0,
          fontSize: "0.85rem",
        }}
      >
        {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

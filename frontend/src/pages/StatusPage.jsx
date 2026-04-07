import { useState } from "react";
import { apiCall } from "../api";
import EndpointBadge from "../components/EndpointBadge";
import ApiErrorBox from "../components/ApiErrorBox";

export default function StatusPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    const res = await apiCall("GET", "/ping");
    setResult(res);
    setLoading(false);
  };

  return (
    <div>
      <h1>Status du serveur</h1>
      <EndpointBadge method="GET" path="/ping" />

      <div style={{ marginTop: "16px" }}>
        <button className="btn" onClick={checkStatus} disabled={loading}>
          {loading ? "Vérification…" : "Tester la connexion"}
        </button>
      </div>

      {result && (
        result.ok ? (
          <div className="success-box">
            <p style={{ fontWeight: 700 }}>✓ Serveur accessible (HTTP {result.status})</p>
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        ) : (
          <ApiErrorBox status={result.status} data={result.data} />
        )
      )}
    </div>
  );
}

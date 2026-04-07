import { useState } from "react";
import { apiCall } from "../api";
import EndpointBadge from "../components/EndpointBadge";
import ApiErrorBox from "../components/ApiErrorBox";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await apiCall("POST", "/auth/register", {
      body: { email, pseudo, password },
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <div>
      <h1>Inscription</h1>
      <EndpointBadge method="POST" path="/auth/register" />

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Pseudo</label>
          <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Envoi…" : "S'inscrire"}
        </button>
      </form>

      {result && (
        result.ok ? (
          <div className="success-box">
            <p style={{ fontWeight: 700 }}>✓ Inscription réussie (HTTP {result.status})</p>
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        ) : (
          <ApiErrorBox status={result.status} data={result.data} />
        )
      )}
    </div>
  );
}

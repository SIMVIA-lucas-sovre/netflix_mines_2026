import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../api";
import { useAuth } from "../context/AuthContext";
import EndpointBadge from "../components/EndpointBadge";
import ApiErrorBox from "../components/ApiErrorBox";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await apiCall("POST", "/auth/login", {
      body: { email, password },
    });
    setResult(res);
    setLoading(false);

    if (res.ok && res.data?.access_token) {
      setToken(res.data.access_token);
      setTimeout(() => navigate("/catalogue"), 500);
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      <EndpointBadge method="POST" path="/auth/login" />

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Envoi…" : "Se connecter"}
        </button>
      </form>

      {result && (
        result.ok ? (
          <div className="success-box">
            <p style={{ fontWeight: 700 }}>✓ Connexion réussie (HTTP {result.status})</p>
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
            <p style={{ color: "#999", marginTop: "8px" }}>Redirection vers le catalogue…</p>
          </div>
        ) : (
          <ApiErrorBox status={result.status} data={result.data} />
        )
      )}
    </div>
  );
}

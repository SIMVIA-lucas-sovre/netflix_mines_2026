import { useState, useEffect } from "react";
import { apiCall } from "../api";
import { useAuth } from "../context/AuthContext";
import EndpointBadge from "../components/EndpointBadge";
import ApiErrorBox from "../components/ApiErrorBox";

export default function PreferencesPage() {
  const { token } = useAuth();
  const [genres, setGenres] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGenres = async () => {
    const res = await apiCall("GET", "/genres");
    if (res.ok) {
      const data = Array.isArray(res.data) ? res.data : [];
      setGenres(data.map((g) => ({ id: g.ID || g.id, name: g.Type || g.name })));
    }
  };

  const fetchPreferences = async () => {
    const res = await apiCall("GET", "/preferences", { token });
    if (res.ok) setPreferences(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    fetchGenres();
    fetchPreferences();
  }, []);

  const addPreference = async () => {
    if (!selectedGenre) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const res = await apiCall("POST", "/preferences", {
      body: { genre_id: Number(selectedGenre) },
      token,
    });
    if (res.ok) {
      setSuccess("Préférence ajoutée");
      fetchPreferences();
    } else {
      setError(res);
    }
    setLoading(false);
  };

  const removePreference = async (genreId) => {
    setError(null);
    setSuccess(null);
    const res = await apiCall("DELETE", `/preferences/${genreId}`, { token });
    if (res.ok) {
      setSuccess("Préférence supprimée");
      fetchPreferences();
    } else {
      setError(res);
    }
  };

  return (
    <div>
      <h1>Préférences de genres</h1>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        <EndpointBadge method="POST" path="/preferences" />
        <EndpointBadge method="DELETE" path="/preferences/{genre_id}" />
        <EndpointBadge method="GET" path="/genres" />
      </div>

      <div style={{ display: "flex", gap: "8px", maxWidth: "400px", marginBottom: "20px" }}>
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">Choisir un genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <button className="btn" onClick={addPreference} disabled={loading || !selectedGenre}>
          Ajouter
        </button>
      </div>

      {success && (
        <div className="success-box" style={{ marginBottom: "12px" }}>
          <p style={{ fontWeight: 700 }}>✓ {success}</p>
        </div>
      )}

      {error && <ApiErrorBox status={error.status} data={error.data} />}

      <h2>Mes préférences</h2>
      {preferences.length === 0 ? (
        <p style={{ color: "#999" }}>Aucune préférence enregistrée.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {preferences.map((pref) => {
            const id = pref.genre_id || pref.id;
            const name = pref.genre_name || pref.name || `Genre #${id}`;
            return (
              <div
                key={id}
                style={{
                  backgroundColor: "#1a1a1a",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>{name}</span>
                <button
                  onClick={() => removePreference(id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e50914",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

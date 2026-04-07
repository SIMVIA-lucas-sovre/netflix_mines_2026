import { useState, useEffect } from "react";
import { apiCall } from "../api";
import { useAuth } from "../context/AuthContext";
import EndpointBadge from "../components/EndpointBadge";
import ApiErrorBox from "../components/ApiErrorBox";
import FilmCard from "../components/FilmCard";

export default function RecommendationsPage() {
  const { token } = useAuth();
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall("GET", "/preferences/recommendations", { token }).then((res) => {
      if (res.ok) {
        setFilms(Array.isArray(res.data) ? res.data : res.data.films || []);
      } else {
        setError(res);
      }
      setLoading(false);
    });
  }, [token]);

  return (
    <div>
      <h1>Recommandations</h1>
      <EndpointBadge method="GET" path="/preferences/recommendations" />

      {loading && <p style={{ color: "#999" }}>Chargement…</p>}

      {error && <ApiErrorBox status={error.status} data={error.data} />}

      {!loading && !error && films.length === 0 && (
        <p style={{ color: "#999" }}>
          Aucune recommandation. Ajoutez des préférences de genres d'abord.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </div>
  );
}

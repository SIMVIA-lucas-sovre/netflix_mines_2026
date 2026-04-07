import { useState, useEffect } from "react";
import { apiCall } from "../api";
import EndpointBadge from "../components/EndpointBadge";
import ApiErrorBox from "../components/ApiErrorBox";
import FilmCard from "../components/FilmCard";
import Pagination from "../components/Pagination";
import "./CataloguePage.css";

export default function CataloguePage() {
  const [films, setFilms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall("GET", "/genres").then((res) => {
      if (res.ok) {
        const data = Array.isArray(res.data) ? res.data : [];
        setGenres(data.map((g) => ({ id: g.ID || g.id, name: g.Type || g.name })));
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = { page };
    if (selectedGenre) params.genre_id = selectedGenre;

    apiCall("GET", "/films", { params }).then((res) => {
      if (res.ok) {
        const data = res.data;
        setFilms(Array.isArray(data) ? data : data.data || data.films || []);
        const total = data.total || 0;
        const perPage = data.per_page || 20;
        setTotalPages(data.total_pages || Math.ceil(total / perPage) || 1);
      } else {
        setError(res);
        setFilms([]);
      }
      setLoading(false);
    });
  }, [page, selectedGenre]);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <h1>Catalogue</h1>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        <EndpointBadge method="GET" path="/films" />
        <EndpointBadge method="GET" path="/genres" />
      </div>

      <div style={{ maxWidth: "300px", marginBottom: "20px" }}>
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">Tous les genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {error && <ApiErrorBox status={error.status} data={error.data} />}

      {loading ? (
        <p style={{ color: "#999" }}>Chargement…</p>
      ) : (
        <>
          <div className="films-grid">
            {films.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
          {films.length === 0 && !error && (
            <p style={{ color: "#999" }}>Aucun film trouvé.</p>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

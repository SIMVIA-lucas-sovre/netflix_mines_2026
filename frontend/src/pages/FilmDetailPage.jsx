import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiCall } from "../api";
import EndpointBadge from "../components/EndpointBadge";
import ApiErrorBox from "../components/ApiErrorBox";
import "./FilmDetailPage.css";

export default function FilmDetailPage() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall("GET", `/films/${id}`).then((res) => {
      if (res.ok) {
        setFilm(res.data);
      } else {
        setError(res);
      }
      setLoading(false);
    });
  }, [id]);

  const title = film?.Nom || film?.title;
  const year = film?.DateSortie || film?.year;
  const note = film?.Note;

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        videoId = u.pathname.slice(1);
      } else if (u.hostname.includes("youtube.com")) {
        videoId = u.searchParams.get("v");
      }
    } catch {
      return null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(film?.Video);

  return (
    <div>
      <Link to="/catalogue" className="back-link">← Retour au catalogue</Link>

      <EndpointBadge method="GET" path={`/films/${id}`} />

      {loading && <p style={{ color: "#999" }}>Chargement…</p>}
      {error && <ApiErrorBox status={error.status} data={error.data} />}

      {film && (
        <>
          <div className="film-hero">
            {film.Image && (
              <div className="film-hero-poster">
                <img src={film.Image} alt={title} />
              </div>
            )}
            <div className="film-hero-info">
              <h1 className="film-hero-title">{title}</h1>
              <div className="film-hero-tags">
                {year && <span className="film-tag">{year}</span>}
                {note != null && (
                  <span className="film-tag film-tag-note">★ {note}/10</span>
                )}
                {film.Genre_ID && (
                  <span className="film-tag">Genre #{film.Genre_ID}</span>
                )}
              </div>
              {film.Video && !embedUrl && (
                <a
                  href={film.Video}
                  target="_blank"
                  rel="noreferrer"
                  className="btn film-trailer-btn"
                >
                  ▶ Bande-annonce
                </a>
              )}
            </div>
          </div>

          {embedUrl && (
            <div className="film-trailer">
              <iframe
                src={embedUrl}
                title="Bande-annonce"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <details className="film-raw-toggle" open>
            <summary>Réponse brute JSON</summary>
            <pre>{JSON.stringify(film, null, 2)}</pre>
          </details>
        </>
      )}
    </div>
  );
}

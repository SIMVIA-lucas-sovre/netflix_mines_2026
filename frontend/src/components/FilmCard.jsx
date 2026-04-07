import { Link } from "react-router-dom";
import "./FilmCard.css";

export default function FilmCard({ film }) {
  const id = film.ID || film.id;
  const title = film.Nom || film.title;
  const year = film.DateSortie || film.year;
  const note = film.Note || film.note;

  return (
    <Link to={`/films/${id}`} className="film-card">
      {film.Image && (
        <img src={film.Image} alt={title} className="film-card-img" />
      )}
      <div className="film-card-body">
        <h3 className="film-card-title">{title}</h3>
        <div className="film-card-meta">
          {year && <span className="film-card-year">{year}</span>}
          {note && <span className="film-card-note">★ {note}</span>}
        </div>
      </div>
    </Link>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">CinéAPI</Link>
      <div className="navbar-links">
        <Link to="/">Status</Link>
        <Link to="/catalogue">Catalogue</Link>
        {isAuthenticated ? (
          <>
            <Link to="/preferences">Préférences</Link>
            <Link to="/recommendations">Recommandations</Link>
            <button onClick={logout} className="navbar-logout">Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/register">Inscription</Link>
            <Link to="/login">Connexion</Link>
          </>
        )}
      </div>
    </nav>
  );
}

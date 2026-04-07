import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import StatusPage from "./pages/StatusPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CataloguePage from "./pages/CataloguePage";
import FilmDetailPage from "./pages/FilmDetailPage";
import PreferencesPage from "./pages/PreferencesPage";
import RecommendationsPage from "./pages/RecommendationsPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<StatusPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/films/:id" element={<FilmDetailPage />} />
          <Route
            path="/preferences"
            element={<ProtectedRoute><PreferencesPage /></ProtectedRoute>}
          />
          <Route
            path="/recommendations"
            element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </>
  );
}

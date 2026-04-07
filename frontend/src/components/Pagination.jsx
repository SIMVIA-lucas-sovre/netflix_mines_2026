export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="btn btn-sm"
      >
        ← Précédent
      </button>
      <span style={{ color: "#999", alignSelf: "center", fontSize: "0.9rem" }}>
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="btn btn-sm"
      >
        Suivant →
      </button>
    </div>
  );
}

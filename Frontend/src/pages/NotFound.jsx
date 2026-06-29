import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: 800,
          color: "#4f46e5",
          margin: 0,
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#111827",
          margin: "0.5rem 0",
        }}
      >
        Page not found
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
        style={{
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "12px 28px",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {isLoggedIn ? "Go to Dashboard" : "Go to Login"}
      </button>
    </div>
  );
}

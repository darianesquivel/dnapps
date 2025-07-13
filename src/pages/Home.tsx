import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ marginBottom: 32 }}>DN APPS</h1>
      <div
        onClick={() => navigate("/yahtzee")}
        style={{
          width: "80vw",
          maxWidth: 320,
          aspectRatio: "1/1",
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 600,
          color: "#333",
          cursor: "pointer",
          transition: "box-shadow 0.2s",
        }}
      >
        Generala
      </div>
    </div>
  );
};

export default Home;

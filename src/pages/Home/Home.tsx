import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons/faArrowCircleUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@radix-ui/themes";
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
      <Button variant="soft" onClick={() => navigate("/yahtzee")}>
        <FontAwesomeIcon icon={faArrowCircleUp} />
        Generala
      </Button>
    </div>
  );
};

export default Home;

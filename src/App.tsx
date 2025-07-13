import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Generala from "./pages/Generala";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generala" element={<Generala />} />
      </Routes>
    </Router>
  );
}

export default App;

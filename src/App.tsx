import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Theme } from "@radix-ui/themes";
import Yahtzee from "./pages/Yahtzee";

function App() {
  return (
    <Theme>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Yahtzee" element={<Yahtzee />} />
        </Routes>
      </Router>
    </Theme>
  );
}

export default App;

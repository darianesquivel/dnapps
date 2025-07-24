import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/index";
import Yahtzee from "./pages/Yahtzee/index";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/yahtzee" element={<Yahtzee/>} />
        </Routes>
      </Router>
  );
}

export default App;

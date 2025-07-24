import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Home  from './pages/home'
import  Yahtzee  from './pages/yahtzee'


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Yahtzee" element={<Yahtzee />} />
        </Routes>
      </Router>
  );
}

export default App;

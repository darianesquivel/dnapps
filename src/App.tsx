import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Home  from './pages/home/index'
import  Yahtzee  from './pages/yahtzee/index'


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

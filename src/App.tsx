import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Home  from './pages/home'
import  YahtzeeGame  from './pages/yahtzee'


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/yahtzee" element={<YahtzeeGame />} />
        </Routes>
      </Router>
  );
}

export default App;

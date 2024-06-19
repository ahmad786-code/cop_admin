 
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import CreateGroup from './CreateGroup';
import CreateConcert from './CreateConcert';
import Navbar from './Navbar';
import Footer from './Footer';
import Articales from './Articales';
import Cities from './Cities';


function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<CreateGroup />} />
            <Route path="/concert" element={<CreateConcert />} />
            <Route path="/articales" element={<Articales />} />
            <Route path="/cities" element={<Cities />} />

          </Routes>
          <Footer/>
        </div>
      </Router>

    </div>
  );
}

export default App;

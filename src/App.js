import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddIncidents from './pages/AddIncidents';
import Login from './pages/Login';
import Home from './pages/Home';
function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Login/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/add' element={<AddIncidents/>} />
      </Routes>
    </Router>
  );
}

export default App;
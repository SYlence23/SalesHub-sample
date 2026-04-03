import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DiscountList from './pages/DiscountList';
import MapView from './pages/Map';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import OfferDetails from './pages/OfferDetails';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/list" element={<DiscountList />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/offer/:id" element={<OfferDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

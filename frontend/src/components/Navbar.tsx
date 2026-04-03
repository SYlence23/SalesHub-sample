import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tag, Map as MapIcon, User, Search, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Search size={20} /> },
    { name: 'Discounts', path: '/list', icon: <Tag size={20} /> },
    { name: 'Map', path: '/map', icon: <MapIcon size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold flex items-center space-x-3 group">
              <img src="/src/assets/IMG_4567.PNG" alt="SalesHub Logo" className="h-10 w-10 object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-900">SalesHub</span>
            </Link>
          </div>
          <nav className="flex space-x-6 items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-slate-600 hover:text-primary-500 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span className="hidden sm:inline">{link.name}</span>
                </Link>
              );
            })}

            {/* Auth specific links */}
            <div className="h-6 w-px bg-slate-300 mx-2"></div>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/profile'
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-slate-600 hover:text-primary-500 hover:bg-slate-50'
                  }`}
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-full interactive-button bg-slate-800 text-white hover:bg-slate-900 transition-colors"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
}

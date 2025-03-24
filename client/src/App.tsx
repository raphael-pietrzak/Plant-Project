import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Preferences from './components/Preferences';
import PlantDetail from './components/PlantDetail';
import PlantForm from './components/PlantForm';
import { Home, Settings, Leaf } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-emerald-700 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="flex items-center py-5 px-2">
                  <Leaf className="h-6 w-6 mr-1" />
                  <span className="font-bold">PlanteCare</span>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                  <Link to="/" className="py-5 px-3 hover:text-emerald-200 flex items-center">
                    <Home className="h-5 w-5 mr-1" />
                    <span>Tableau de bord</span>
                  </Link>
                  <Link to="/preferences" className="py-5 px-3 hover:text-emerald-200 flex items-center">
                    <Settings className="h-5 w-5 mr-1" />
                    <span>Préférences</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/plants/:id" element={<PlantDetail />} />
            <Route path="/plants/add" element={<PlantForm />} />
            <Route path="/plants/edit/:id" element={<PlantForm />} />
          </Routes>
        </div>

        <footer className="bg-white py-4 mt-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} PlanteCare - Tous droits réservés
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
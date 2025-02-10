import { useState } from 'react';
import { Sprout, Home, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Preferences from './components/Preferences';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">Projet Plante IoT</span>
            </div>
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'home'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-emerald-600'
                }`}
              >
                <Home className="h-5 w-5 mr-1" />
                Accueil
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'preferences'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-emerald-600'
                }`}
              >
                <Settings className="h-5 w-5 mr-1" />
                Préférences
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'home' ? <Dashboard /> : <Preferences />}
      </main>
    </div>
  );
}

export default App;
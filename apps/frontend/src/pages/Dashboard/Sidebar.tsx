import React from 'react';
import { 
  Home, 
  Mic, 
  Play, 
  Settings, 
  Users, 
  Calendar,
  BarChart3,
  LogOut,
  Headphones
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'studio', label: 'Record', icon: Mic },
    { id: 'recordings', label: 'My Recordings', icon: Play },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'calendar', label: 'Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white">PodcastPro</span>
            <p className="text-sm text-gray-400">Recording Studio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-200 group ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/25'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${activeView === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              <span className="font-medium text-lg">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-white/10">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">Alex Johnson</p>
              <p className="text-sm text-gray-400">Pro Plan</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
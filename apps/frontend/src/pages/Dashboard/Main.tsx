import  { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Studio from './Studio';
import Recordings from './Recording';
import Settings from './Setting';
import axios from 'axios';
import { API_URL } from '../../config';


function Main() {
    const [activeView, setActiveView] = useState('dashboard');
    
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

  
  if(token && !userData){
     useEffect(() => {
        const userData = async () => {
            const response = await axios.get(`${API_URL}/user/getUserDetails`,{
              headers: {
                Authorization: `${token}`,
              },
            });
            localStorage.setItem("userData", JSON.stringify(response.data.user));
        };
        userData();
    }, []);
  } 
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onStartRecording={() => setActiveView('studio')} />;
      case 'studio':
        return <Studio />;
      case 'recordings':
        return <Recordings />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onStartRecording={() => setActiveView('studio')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex min-h-screen">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-hidden">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default Main;
import React, { useState } from 'react';
import { Mic, Play, Clock, Users, Headphones, AudioWaveform as Waveform, Calendar, TrendingUp, Plus, ArrowRight, Star, Download, Share2 } from 'lucide-react';

interface DashboardProps {
  onStartRecording: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartRecording }) => {
  const [recordingType, setRecordingType] = useState<'solo' | 'interview' | 'group'>('solo');

  const recentRecordings = [
    {
      id: 1,
      title: 'Episode 47: The Future of AI',
      duration: '1:23:45',
      date: '2 hours ago',
      waveform: '/api/placeholder/200/40',
      plays: 1247,
      status: 'published'
    },
    {
      id: 2,
      title: 'Marketing Deep Dive',
      duration: '45:32',
      date: '1 day ago',
      waveform: '/api/placeholder/200/40',
      plays: 892,
      status: 'draft'
    },
    {
      id: 3,
      title: 'Startup Stories #12',
      duration: '32:18',
      date: '3 days ago',
      waveform: '/api/placeholder/200/40',
      plays: 2156,
      status: 'published'
    }
  ];

  const quickStats = [
    { label: 'Total Episodes', value: '47', icon: Play, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Listens', value: '12.4K', icon: Headphones, color: 'from-purple-500 to-pink-500' },
    { label: 'Recording Hours', value: '89.5', icon: Clock, color: 'from-green-500 to-emerald-500' },
    { label: 'This Month', value: '8', icon: TrendingUp, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Alex</span>
            </h1>
            <p className="text-xl text-gray-300">Ready to create something amazing?</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Today</p>
            <p className="text-white text-lg font-semibold">December 15, 2024</p>
          </div>
        </div>

        {/* Quick Start Recording */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Start Recording Now</h2>
              <p className="text-purple-200 mb-6">Choose your recording type and begin instantly</p>
              
              <div className="flex space-x-4 mb-6">
                {[
                  { type: 'solo', label: 'Solo', icon: Mic },
                  { type: 'interview', label: 'Interview', icon: Users },
                  { type: 'group', label: 'Group', icon: Users }
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setRecordingType(type as any)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                      recordingType === type
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={onStartRecording}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                <span>Start Recording</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Recordings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Recordings</h2>
            <button className="text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-2">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentRecordings.map((recording) => (
              <div key={recording.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-1">{recording.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{recording.duration}</span>
                        </span>
                        <span>{recording.date}</span>
                        <span className="flex items-center space-x-1">
                          <Headphones className="w-4 h-4" />
                          <span>{recording.plays}</span>
                        </span>
                      </div>
                      
                      {/* Waveform Visualization */}
                      <div className="flex items-center space-x-1 mb-2">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                            style={{ height: `${Math.random() * 20 + 8}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      recording.status === 'published' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {recording.status}
                    </span>
                    
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Play className="w-4 h-4 text-white" />
                      </button>
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-white" />
                      </button>
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-4 text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Schedule Recording</p>
                    <p className="text-sm text-gray-400">Plan your next episode</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              </button>
              
              <button className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 text-left hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Invite Guests</p>
                    <p className="text-sm text-gray-400">Collaborate with others</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              </button>
              
              <button className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4 text-left hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Waveform className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Audio Editor</p>
                    <p className="text-sm text-gray-400">Edit your recordings</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              </button>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Pro Tip</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  For best audio quality, record in a quiet room and use headphones to monitor your audio levels in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
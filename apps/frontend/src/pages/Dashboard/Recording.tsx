import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Share2, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  Clock,
  Headphones,
  MoreHorizontal,
  Edit3,
  Star,
  Eye,
  TrendingUp
} from 'lucide-react';

const Recordings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const recordings = [
    {
      id: 1,
      title: 'The Future of AI in Content Creation',
      duration: '1:23:45',
      date: '2024-01-15',
      size: '1.2 GB',
      status: 'published',
      plays: 2847,
      likes: 156,
      thumbnail: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
      waveform: Array.from({ length: 50 }, () => Math.random() * 40 + 10)
    },
    {
      id: 2,
      title: 'Marketing Strategies for 2024',
      duration: '45:32',
      date: '2024-01-14',
      size: '850 MB',
      status: 'draft',
      plays: 1203,
      likes: 89,
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      waveform: Array.from({ length: 50 }, () => Math.random() * 40 + 10)
    },
    {
      id: 3,
      title: 'Startup Success Stories',
      duration: '32:18',
      date: '2024-01-13',
      size: '640 MB',
      status: 'published',
      plays: 3421,
      likes: 234,
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      waveform: Array.from({ length: 50 }, () => Math.random() * 40 + 10)
    },
    {
      id: 4,
      title: 'Remote Work Best Practices',
      duration: '28:15',
      date: '2024-01-12',
      size: '420 MB',
      status: 'published',
      plays: 1876,
      likes: 112,
      thumbnail: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=400',
      waveform: Array.from({ length: 50 }, () => Math.random() * 40 + 10)
    },
    {
      id: 5,
      title: 'Tech Industry Insights',
      duration: '1:05:20',
      date: '2024-01-11',
      size: '980 MB',
      status: 'processing',
      plays: 0,
      likes: 0,
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      waveform: Array.from({ length: 50 }, () => Math.random() * 40 + 10)
    },
    {
      id: 6,
      title: 'Design Thinking Workshop',
      duration: '52:40',
      date: '2024-01-10',
      size: '760 MB',
      status: 'published',
      plays: 2156,
      likes: 178,
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      waveform: Array.from({ length: 50 }, () => Math.random() * 40 + 10)
    }
  ];

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || recording.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const totalStats = {
    recordings: recordings.length,
    totalPlays: recordings.reduce((sum, r) => sum + r.plays, 0),
    totalHours: recordings.reduce((sum, r) => {
      const [hours, minutes] = r.duration.split(':').map(Number);
      return sum + hours + minutes / 60;
    }, 0),
    totalSize: recordings.reduce((sum, r) => {
      const size = parseFloat(r.size.replace(/[^\d.]/g, ''));
      return sum + (r.size.includes('GB') ? size : size / 1000);
    }, 0)
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Recordings</h1>
          <p className="text-xl text-gray-300">Manage and share your podcast episodes</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-80"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="processing">Processing</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{totalStats.recordings}</p>
              <p className="text-blue-300">Total Episodes</p>
            </div>
            <Play className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{totalStats.totalPlays.toLocaleString()}</p>
              <p className="text-green-300">Total Plays</p>
            </div>
            <Headphones className="w-10 h-10 text-green-400" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{Math.round(totalStats.totalHours)}h</p>
              <p className="text-purple-300">Content Hours</p>
            </div>
            <Clock className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{totalStats.totalSize.toFixed(1)} GB</p>
              <p className="text-orange-300">Storage Used</p>
            </div>
            <Download className="w-10 h-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Recordings Grid */}
      <div className="space-y-6">
        {filteredRecordings.map((recording) => (
          <div key={recording.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-200 group">
            <div className="flex items-center space-x-6">
              {/* Thumbnail */}
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src={recording.thumbnail} 
                  alt={recording.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {recording.duration}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{recording.title}</h3>
                    <div className="flex items-center space-x-6 text-sm text-gray-400 mb-3">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(recording.date)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{recording.size}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Headphones className="w-4 h-4" />
                        <span>{recording.plays.toLocaleString()} plays</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{recording.likes} likes</span>
                      </span>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    recording.status === 'published' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : recording.status === 'draft'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {recording.status}
                  </span>
                </div>

                {/* Waveform */}
                <div className="mb-4">
                  <div className="flex items-center space-x-1 h-12">
                    {recording.waveform.map((height, index) => (
                      <div
                        key={index}
                        className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200">
                      <Play className="w-4 h-4" />
                      <span>Play</span>
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                      <Edit3 className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {recording.status === 'published' && (
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{recording.plays}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span>+12%</span>
                        </span>
                      </div>
                    )}
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecordings.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No recordings found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search terms or create your first recording</p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200">
            Start Recording
          </button>
        </div>
      )}
    </div>
  );
};

export default Recordings;
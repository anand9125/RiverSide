import React, { useState } from 'react';
import { 
  User, 
  Mic, 
  Video, 
  Bell, 
  Shield, 
  CreditCard,
  Trash2,
  Save,
  Upload,
  Camera,
  Headphones,
  Monitor,
  Palette,
  Globe,
  Lock
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'recording', label: 'Recording', icon: Mic },
    { id: 'audio', label: 'Audio & Video', icon: Video },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Profile Settings</h3>
              
              {/* Profile Photo */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">A</span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload New Photo</span>
                  </button>
                  <p className="text-sm text-gray-400 mt-2">JPG, PNG or GIF. Max size 5MB</p>
                </div>
              </div>
              
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="Alex"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Johnson"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="alex.johnson@example.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  rows={4}
                  defaultValue="Passionate podcaster and content creator exploring the intersection of technology, creativity, and human connection."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>
        );
        
      case 'recording':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Recording Preferences</h3>
              
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white mb-1">Auto-start Recording</h4>
                      <p className="text-sm text-gray-400">Automatically begin recording when entering studio</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white mb-1">Save Local Backup</h4>
                      <p className="text-sm text-gray-400">Keep a local copy of recordings on your device</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Default Video Quality</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                      <option>1080p HD</option>
                      <option>720p</option>
                      <option>480p</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Default Audio Quality</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                      <option>High (48kHz)</option>
                      <option>Standard (44.1kHz)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'audio':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Audio & Video Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Mic className="w-5 h-5 mr-2" />
                    Audio Devices
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Microphone</label>
                      <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                        <option>Default - Built-in Microphone</option>
                        <option>USB Microphone</option>
                        <option>Blue Yeti USB Microphone</option>
                        <option>Audio-Technica AT2020USB+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Speakers/Headphones</label>
                      <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                        <option>Default - Built-in Speakers</option>
                        <option>AirPods Pro</option>
                        <option>Sony WH-1000XM4</option>
                        <option>External Speakers</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Video Devices
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Camera</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                      <option>Built-in Camera</option>
                      <option>Logitech C920</option>
                      <option>Sony Alpha a7 III</option>
                      <option>Canon EOS M50</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Audio Enhancements</h4>
                  <div className="space-y-4">
                    {[
                      { title: 'Noise Cancellation', desc: 'Reduce background noise during recording' },
                      { title: 'Echo Cancellation', desc: 'Prevent audio feedback and echoes' },
                      { title: 'Auto Gain Control', desc: 'Automatically adjust microphone levels' },
                      { title: 'Voice Enhancement', desc: 'Optimize voice clarity and tone' }
                    ].map((feature, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">{feature.title}</p>
                            <p className="text-sm text-gray-400">{feature.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { title: 'Recording Started', desc: 'When a recording session begins', enabled: true },
                  { title: 'Recording Completed', desc: 'When processing is finished', enabled: true },
                  { title: 'Guest Joined', desc: 'When someone joins your studio', enabled: true },
                  { title: 'Scheduled Reminders', desc: 'Before upcoming sessions', enabled: false },
                  { title: 'Storage Alerts', desc: 'When approaching storage limit', enabled: true },
                  { title: 'New Comments', desc: 'When listeners leave comments', enabled: false },
                  { title: 'Weekly Summary', desc: 'Analytics and performance reports', enabled: true }
                ].map((notification, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white mb-1">{notification.title}</p>
                        <p className="text-sm text-gray-400">{notification.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={notification.enabled} />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'privacy':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Privacy & Security</h3>
              
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white mb-1">Public Profile</h4>
                      <p className="text-sm text-gray-400">Allow others to find and view your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="font-semibold text-white mb-4">Data Retention</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Keep recordings for 1 year', value: '1year', checked: true },
                      { label: 'Keep recordings for 6 months', value: '6months', checked: false },
                      { label: 'Keep recordings indefinitely', value: 'forever', checked: false }
                    ].map((option, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name="retention" 
                          value={option.value}
                          defaultChecked={option.checked}
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                  <h4 className="font-semibold text-red-300 mb-4 flex items-center">
                    <Trash2 className="w-5 h-5 mr-2" />
                    Danger Zone
                  </h4>
                  <p className="text-red-200 text-sm mb-4 leading-relaxed">
                    Permanently delete your account and all associated data. This action cannot be undone and will immediately remove all your recordings, settings, and profile information.
                  </p>
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'billing':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h3>
              
              <div className="space-y-8">
                {/* Current Plan */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-2">Pro Plan</h4>
                      <p className="text-purple-300">Unlimited recordings • HD quality • Priority support • Advanced analytics</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">$19</p>
                      <p className="text-purple-300">per month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-300">Next billing date: January 15, 2025</p>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors">
                      Change Plan
                    </button>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Payment Method</h4>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">•••• •••• •••• 4242</p>
                          <p className="text-gray-400 text-sm">Expires 12/26 • Visa</p>
                        </div>
                      </div>
                      <button className="text-purple-400 hover:text-purple-300 font-medium">
                        Update
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Usage This Month */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Usage This Month</h4>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="space-y-4">
                      {[
                        { label: 'Recording Hours', used: '24.5', limit: 'Unlimited', percentage: 0 },
                        { label: 'Storage Used', used: '4.2 GB', limit: 'Unlimited', percentage: 0 },
                        { label: 'Guests Invited', used: '12', limit: 'Unlimited', percentage: 0 },
                        { label: 'Downloads', used: '156', limit: 'Unlimited', percentage: 0 }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{item.label}</span>
                          <span className="text-white font-medium">{item.used} / {item.limit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Billing History */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Recent Invoices</h4>
                  <div className="space-y-3">
                    {[
                      { date: 'Dec 15, 2024', amount: '$19.00', status: 'Paid' },
                      { date: 'Nov 15, 2024', amount: '$19.00', status: 'Paid' },
                      { date: 'Oct 15, 2024', amount: '$19.00', status: 'Paid' }
                    ].map((invoice, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{invoice.date}</p>
                          <p className="text-gray-400 text-sm">Pro Plan</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{invoice.amount}</p>
                          <span className="text-green-400 text-sm">{invoice.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-xl text-gray-300">Customize your podcast recording experience</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-80">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            {renderTabContent()}
            
            {/* Save Button */}
            <div className="flex justify-end space-x-4 mt-12 pt-8 border-t border-white/10">
              <button className="px-6 py-3 text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 font-medium">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
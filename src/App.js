import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, ExternalLink, Filter, Calendar, DollarSign, Sparkles, Lock, LogOut, Eye, EyeOff } from 'lucide-react';

const DutaAirdrop = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Auth states
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    status: 'ongoing',
    category: '',
    reward: '',
    deadline: '',
    tutorialLink: ''
  });

  const categories = ['DeFi', 'NFT', 'GameFi', 'Layer 1', 'Layer 2', 'DEX', 'Lending', 'Social', 'AI', 'Other'];
  const statuses = ['waitlist', 'ongoing', 'TGE'];

  useEffect(() => {
    loadAirdrops();
    loadAdminPassword();
  }, []);

  const loadAirdrops = () => {
    try {
      const stored = localStorage.getItem('duta-airdrops-list');
      if (stored) {
        setAirdrops(JSON.parse(stored));
      }
    } catch (error) {
      console.log('No existing data');
    }
  };

  const loadAdminPassword = () => {
    try {
      const stored = localStorage.getItem('duta-admin-password');
      if (stored) {
        setAdminPassword(stored);
      } else {
        // Jika belum ada password, set password pertama kali
        setIsSettingPassword(true);
        setShowLoginModal(true);
      }
    } catch (error) {
      setIsSettingPassword(true);
      setShowLoginModal(true);
    }
  };

  const saveAdminPassword = (password) => {
    try {
      localStorage.setItem('duta-admin-password', password);
      setAdminPassword(password);
    } catch (error) {
      console.error('Failed to save password:', error);
    }
  };

  const saveAirdrops = (data) => {
    try {
      localStorage.setItem('duta-airdrops-list', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleLogin = () => {
    if (isSettingPassword) {
      if (loginPassword.length < 4) {
        alert('Password minimal 4 karakter!');
        return;
      }
      saveAdminPassword(loginPassword);
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginPassword('');
      setIsSettingPassword(false);
      alert('Password berhasil dibuat! Jangan lupa password ini.');
    } else {
      if (loginPassword === adminPassword) {
        setIsAdmin(true);
        setShowLoginModal(false);
        setLoginPassword('');
      } else {
        alert('Password salah!');
      }
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.status) {
      alert('Nama proyek dan status wajib diisi!');
      return;
    }
    
    if (editingId) {
      const updated = airdrops.map(a => a.id === editingId ? { ...formData, id: editingId } : a);
      setAirdrops(updated);
      saveAirdrops(updated);
    } else {
      const newAirdrop = { ...formData, id: Date.now() };
      const updated = [...airdrops, newAirdrop];
      setAirdrops(updated);
      saveAirdrops(updated);
    }
    
    resetForm();
  };

  const handleEdit = (airdrop) => {
    setFormData(airdrop);
    setEditingId(airdrop.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Yakin ingin menghapus airdrop ini?')) {
      const updated = airdrops.filter(a => a.id !== id);
      setAirdrops(updated);
      saveAirdrops(updated);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      link: '',
      status: 'ongoing',
      category: '',
      reward: '',
      deadline: '',
      tutorialLink: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'waitlist': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'ongoing': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'TGE': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getFilteredAndSorted = () => {
    let filtered = airdrops.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      const matchCategory = filterCategory === 'all' || a.category === filterCategory;
      return matchSearch && matchStatus && matchCategory;
    });

    switch(sortBy) {
      case 'newest':
        return filtered.sort((a, b) => b.id - a.id);
      case 'oldest':
        return filtered.sort((a, b) => a.id - b.id);
      case 'deadline':
        return filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-4 space-x-3 animate-fade-in">
            <Sparkles className="w-10 h-10 text-blue-400 animate-bounce" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Duta Airdrop
            </h1>
            <Sparkles className="w-10 h-10 text-pink-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your ultimate guide to discovering and tracking the latest crypto airdrops. Never miss an opportunity!
          </p>
          
          {/* Admin Controls */}
          <div className="mt-6 flex justify-center">
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg font-semibold flex items-center space-x-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Admin</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg font-semibold flex items-center space-x-2 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search airdrops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
              />
            </div>

            {/* Add Button - Only for Admin */}
            {isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                <span>Add Airdrop</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-all backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-all backdrop-blur-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-all backdrop-blur-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="deadline">By Deadline</option>
              <option value="name">By Name</option>
            </select>
          </div>
        </div>

        {/* Airdrops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredAndSorted().map((airdrop, index) => (
            <div
              key={airdrop.id}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{airdrop.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(airdrop.status)}`}>
                      {airdrop.status.toUpperCase()}
                    </span>
                    {airdrop.category && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/50">
                        {airdrop.category}
                      </span>
                    )}
                  </div>
                </div>
                {/* Edit/Delete buttons - Only for Admin */}
                {isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(airdrop)}
                      className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(airdrop.id)}
                      className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{airdrop.description}</p>

              <div className="space-y-2 mb-4 text-sm">
                {airdrop.reward && (
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-gray-400">Reward:</span>
                    <span className="ml-2 font-semibold text-green-400">{airdrop.reward}</span>
                  </div>
                )}
                {airdrop.deadline && (
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                    <span className="text-gray-400">Deadline:</span>
                    <span className="ml-2 font-semibold">{airdrop.deadline}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {airdrop.link && (
                  <a
                    href={airdrop.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                  >
                    <span>Join Airdrop</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {airdrop.tutorialLink && (
                  <a
                    href={airdrop.tutorialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg font-semibold transition-all"
                  >
                    Tutorial
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {getFilteredAndSorted().length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No airdrops found. {isAdmin ? 'Add your first airdrop to get started!' : 'Check back later for new opportunities!'}</p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <Lock className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {isSettingPassword ? 'Set Admin Password' : 'Admin Login'}
            </h2>
            <p className="text-gray-400 text-center mb-6">
              {isSettingPassword ? 'Buat password untuk akses admin' : 'Masukkan password admin'}
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder={isSettingPassword ? "Buat password (min. 4 karakter)" : "Masukkan password"}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleLogin}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  {isSettingPassword ? 'Set Password' : 'Login'}
                </button>
                {!isSettingPassword && (
                  <button
                    onClick={() => {
                      setShowLoginModal(false);
                      setLoginPassword('');
                    }}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal - Only accessible when Admin */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {editingId ? 'Edit Airdrop' : 'Add New Airdrop'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g., ZkSync"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  rows="3"
                  placeholder="Brief description of the airdrop..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Airdrop Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Tutorial Link (Telegram)</label>
                <input
                  type="url"
                  value={formData.tutorialLink}
                  onChange={(e) => setFormData({...formData, tutorialLink: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="https://t.me/..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Estimated Reward</label>
                  <input
                    type="text"
                    value={formData.reward}
                    onChange={(e) => setFormData({...formData, reward: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="e.g., $100-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Deadline/Estimate</label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="e.g., Q1 2025 or 2025-03-31"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  {editingId ? 'Update' : 'Add'} Airdrop
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DutaAirdrop;
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PlusCircle, Image as ImageIcon, Link2, ListPlus, Database, Activity } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AdminAnalytics from '../components/AdminAnalytics';
import './AdminDashboard.css';

function AdminDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Active',
    cost_type: 'Free',
    referral_link: '',
    banner_image_url: '',
    logo_image_url: '',
    tutorial_steps: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [airdrops, setAirdrops] = useState([]);
  
  useEffect(() => {
    fetchAirdrops();
  }, []);

  async function fetchAirdrops() {
    try {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAirdrops(data || []);
    } catch (error) {
      console.error('Error fetching airdrops for admin:', error.message);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Split tutorial steps by newline
      const stepsArray = formData.tutorial_steps
        .split('\n')
        .map(step => step.trim())
        .filter(step => step.length > 0);

      const { data, error } = await supabase
        .from('airdrops')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            cost_type: formData.cost_type,
            referral_link: formData.referral_link,
            banner_image_url: formData.banner_image_url || 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop',
            logo_image_url: formData.logo_image_url || 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=200&auto=format&fit=crop',
            tutorial_steps: stepsArray
          }
        ]);

      if (error) throw error;
      
      setMessage('Airdrop berhasil ditambahkan ke database!');
      setFormData({
        title: '', description: '', status: 'Active', cost_type: 'Free',
        referral_link: '', banner_image_url: '', logo_image_url: '', tutorial_steps: ''
      });
      fetchAirdrops();
      
      
    } catch (error) {
      console.error('Error inserting data:', error);
      setMessage(`Gagal menyimpan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header notion-card">
        <div>
          <h1 style={{ fontFamily: 'Lora, serif', marginBottom: '4px' }}>Mission Control</h1>
          <p className="text-muted">Manage your airdrop missions & intel.</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary">Keluar Panel</button>
      </div>

      <div className="admin-grid">
        <div className="admin-card notion-card" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontFamily: 'Lora, serif' }}>
            <PlusCircle color="var(--text-main)" /> Tambah Airdrop Baru
          </h2>
          
          {message && (
            <div style={{ padding: '1rem', background: message.includes('Gagal') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: message.includes('Gagal') ? '#fca5a5' : '#6ee7b7', borderRadius: '8px', marginBottom: '1rem' }}>
              {message}
            </div>
          )}

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nama Airdrop</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Cth: LunaDrop" required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Claimable">Claimable</option>
                  <option value="Ended">Ended</option>
                </select>
              </div>
              <div className="form-group">
                <label>Modal</label>
                <select name="cost_type" value={formData.cost_type} onChange={handleChange}>
                  <option value="Free">Free</option>
                  <option value="Gas Fee">Gas Fee</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Deskripsi Singkat</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Jelaskan kriteria dan potensi airdrop ini..." required></textarea>
            </div>

            <div className="form-group">
              <label>Link Referral Tujuan <Link2 size={16} style={{display: 'inline', verticalAlign: 'middle'}}/></label>
              <input type="url" name="referral_link" value={formData.referral_link} onChange={handleChange} placeholder="https://..." required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><ImageIcon size={16} style={{display: 'inline', verticalAlign: 'middle'}}/> Link / URL Logo (Kotak)</label>
                <input type="url" name="logo_image_url" value={formData.logo_image_url} onChange={handleChange} placeholder="https://..." />
                <small className="text-muted">*sementara gunakan link gambar online</small>
              </div>
              <div className="form-group">
                <label><ImageIcon size={16} style={{display: 'inline', verticalAlign: 'middle'}}/> Link / URL Banner (Panjang)</label>
                <input type="url" name="banner_image_url" value={formData.banner_image_url} onChange={handleChange} placeholder="https://..." />
                <small className="text-muted">*sementara gunakan link gambar online</small>
              </div>
            </div>

            <div className="form-group">
              <label>Tutorial Steps (Pisahkan dengan Enter) <ListPlus size={16} style={{display: 'inline', verticalAlign: 'middle'}}/></label>
              <textarea name="tutorial_steps" value={formData.tutorial_steps} onChange={handleChange} rows="5" placeholder="1. Buka link...&#10;2. Connect wallet...&#10;3. Follow twitter..." required></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '16px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Menyimpan...' : 'Launch Mission (Simpan Data)'}
            </button>
          </form>
        </div>

        <div className="admin-side-panel">
          <div className="admin-card notion-card sidebar-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontFamily: 'Lora, serif' }}>
              <Activity color="var(--text-main)"/> Analytics
            </h3>
            <AdminAnalytics airdrops={airdrops} />
          </div>

          <div className="admin-card notion-card sidebar-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontFamily: 'Lora, serif' }}>
               <Database color="var(--text-main)"/> Manage Airdrops
            </h3>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
              Anda dapat mengedit dan menghapus data airdrop yang sudah terpublikasi secara real-time.
            </p>
            <AdminTable airdrops={airdrops} fetchAirdrops={fetchAirdrops} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

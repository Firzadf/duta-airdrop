import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Settings, Save } from 'lucide-react';

function AdminGlobalSettings() {
  const [settingsId, setSettingsId] = useState(null);
  const [formData, setFormData] = useState({
    telegram_link: '',
    twitter_link: '',
    community_count: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettingsId(data.id);
        setFormData({
          telegram_link: data.telegram_link || '',
          twitter_link: data.twitter_link || '',
          community_count: data.community_count || ''
        });
      }
    } catch (error) {
      console.error('Error fetching global settings:', error.message);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (settingsId) {
        // Update existing
        const { error } = await supabase
          .from('global_settings')
          .update({
            telegram_link: formData.telegram_link,
            twitter_link: formData.twitter_link,
            community_count: formData.community_count,
            updated_at: new Date().toISOString()
          })
          .eq('id', settingsId);
        
        if (error) throw error;
      } else {
        // Insert new if doesn't exist yet
        const { data, error } = await supabase
          .from('global_settings')
          .insert([{
            telegram_link: formData.telegram_link,
            twitter_link: formData.twitter_link,
            community_count: formData.community_count
          }])
          .select();
        
        if (error) throw error;
        if (data && data.length > 0) setSettingsId(data[0].id);
      }
      
      setMessage('Luar biasa! Pengaturan global berhasil diperbarui.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving global settings:', error.message);
      setMessage(`Gagal menyimpan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card notion-card sidebar-card" style={{ marginBottom: '24px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontFamily: 'Lora, serif' }}>
         <Settings color="var(--text-main)"/> Site Configuration
      </h3>
      <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
        Atur tautan sosial dan statistik komunitas yang akan tampil di halaman Beranda.
      </p>

      {message && (
        <div style={{ padding: '12px', background: message.includes('Gagal') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: message.includes('Gagal') ? '#fca5a5' : '#6ee7b7', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="form-group">
          <label>Link Telegram Utama</label>
          <input 
            type="url" 
            name="telegram_link" 
            value={formData.telegram_link} 
            onChange={handleChange} 
            placeholder="https://t.me/..." 
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group">
          <label>Link Twitter/X Utama</label>
          <input 
            type="url" 
            name="twitter_link" 
            value={formData.twitter_link} 
            onChange={handleChange} 
            placeholder="https://x.com/..." 
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group">
          <label>Jumlah Komunitas (Label)</label>
          <input 
            type="text" 
            name="community_count" 
            value={formData.community_count} 
            onChange={handleChange} 
            placeholder="Cth: 10,500+" 
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }} disabled={loading}>
          <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </form>
    </div>
  );
}

export default AdminGlobalSettings;

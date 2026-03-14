import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AirdropCard from '../components/AirdropCard';
import DailyTracker from '../components/DailyTracker';
import { Rocket, ShieldCheck, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Home.css';

function Home() {
  const [airdrops, setAirdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [globalSettings, setGlobalSettings] = useState({
    telegram_link: 'https://t.me/',
    community_count: '1,200+'
  });
  const { t } = useTranslation();

  useEffect(() => {
    fetchAirdrops();
    fetchGlobalSettings();
  }, []);

  async function fetchGlobalSettings() {
    try {
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (data) {
        setGlobalSettings(data);
      }
    } catch (error) {
      console.log('No global settings found, using defaults.');
    }
  }

  async function fetchAirdrops() {
    try {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAirdrops(data || []);
    } catch (error) {
      console.error('Error fetching airdrops:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredAirdrops = airdrops.filter(drop => {
    if (filter === 'All') return true;
    if (filter === 'Active') return drop.status.toLowerCase() === 'active';
    if (filter === 'Claimable') return drop.status.toLowerCase() === 'claimable';
    return true;
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">{t('home.hero_title_1')}<br/>{t('home.hero_title_2')} <span>Airdrop</span> 🚀</h1>
        <p className="hero-subtitle text-muted">
          {t('home.hero_subtitle')}
        </p>
        <div className="hero-ctas">
          <a href="#airdrop-list" className="btn-primary">{t('home.btn_explore')}</a>
          <a href={globalSettings.telegram_link} target="_blank" rel="noreferrer" className="btn-secondary">{t('home.btn_telegram')}</a>
        </div>
      </section>

      {/* Stats & Tracker Section */}
      <section className="stats-tracker-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '64px' }}>
        <div className="stats-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="notion-card stat-card" style={{ marginBottom: 0 }}>
              <Rocket className="stat-icon" color="var(--text-muted)" />
              <h3 className="stat-value">{airdrops.length}+</h3>
              <p className="stat-label text-muted">{t('home.stat_projects')}</p>
            </div>
            <div className="notion-card stat-card" style={{ marginBottom: 0 }}>
              <Users className="stat-icon" color="var(--text-muted)" />
              <h3 className="stat-value">{globalSettings.community_count}</h3>
              <p className="stat-label text-muted">{t('home.stat_community')}</p>
            </div>
          </div>
          <div className="notion-card stat-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '16px' }}>
            <ShieldCheck className="stat-icon" color="var(--text-muted)" style={{ marginBottom: 0 }} />
            <h3 className="stat-value" style={{ marginBottom: 0, fontSize: '24px' }}>100% {t('home.stat_tested')}</h3>
          </div>
        </div>
        
        <DailyTracker />
      </section>

      {/* Airdrop List Section */}
      <section id="airdrop-list" className="airdrop-list-section">
        <div className="section-header">
          <h2 className="section-title">{t('home.section_title_1')} <span>{t('home.section_title_2')}</span></h2>
          <div className="filter-tabs">
            <button 
              className={`filter-btn ${filter === 'All' ? 'active' : 'text-muted'}`}
              onClick={() => setFilter('All')}
            >
              {t('home.filter_all')}
            </button>
            <button 
              className={`filter-btn ${filter === 'Active' ? 'active' : 'text-muted'}`}
              onClick={() => setFilter('Active')}
            >
              🚀 {t('home.filter_active')}
            </button>
            <button 
              className={`filter-btn ${filter === 'Claimable' ? 'active' : 'text-muted'}`}
              onClick={() => setFilter('Claimable')}
            >
              ✅ {t('home.filter_claimable')}
            </button>
          </div>
        </div>

        <div className="airdrop-grid">
          {loading ? (
            <p className="text-muted">{t('home.loading')}</p>
          ) : filteredAirdrops.length === 0 ? (
            <p className="text-muted">{t('home.empty')} (Filter: {filter})</p>
          ) : (
            filteredAirdrops.map(project => (
              <AirdropCard key={project.id} project={project} />
            ))
          )}
        </div>
      </section>
      
      {/* Footer / Join Newsletter */}
      <footer className="footer-section notion-card">
        <h2>{t('home.footer_title')}</h2>
        <p className="text-muted">{t('home.footer_desc')}</p>
        <a href={globalSettings.telegram_link} target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          {t('home.footer_btn')}
        </a>
      </footer>
    </div>
  );
}

export default Home;

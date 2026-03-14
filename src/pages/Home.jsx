import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AirdropCard from '../components/AirdropCard';
import { Rocket, ShieldCheck, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Home.css';

function Home() {
  const [airdrops, setAirdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
      console.error('Error fetching airdrops:', error.message);
    } finally {
      setLoading(false);
    }
  }

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
          <a href="https://t.me/your_telegram_group" target="_blank" rel="noreferrer" className="btn-secondary">{t('home.btn_telegram')}</a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="notion-card stat-card">
          <Rocket className="stat-icon" color="var(--text-muted)" />
          <h3 className="stat-value">{airdrops.length}+</h3>
          <p className="stat-label text-muted">{t('home.stat_projects')}</p>
        </div>
        <div className="notion-card stat-card">
          <Users className="stat-icon" color="var(--text-muted)" />
          <h3 className="stat-value">1,200+</h3>
          <p className="stat-label text-muted">{t('home.stat_community')}</p>
        </div>
        <div className="notion-card stat-card">
          <ShieldCheck className="stat-icon" color="var(--text-muted)" />
          <h3 className="stat-value">100%</h3>
          <p className="stat-label text-muted">{t('home.stat_tested')}</p>
        </div>
      </section>

      {/* Airdrop List Section */}
      <section id="airdrop-list" className="airdrop-list-section">
        <div className="section-header">
          <h2 className="section-title">{t('home.section_title_1')} <span>{t('home.section_title_2')}</span></h2>
          <div className="filter-tabs">
            <button className="filter-btn active">{t('home.filter_all')}</button>
            <button className="filter-btn text-muted">🚀 {t('home.filter_active')}</button>
            <button className="filter-btn text-muted">✅ {t('home.filter_claimable')}</button>
          </div>
        </div>

        <div className="airdrop-grid">
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>{t('home.loading')}</p>
          ) : airdrops.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>{t('home.empty')}</p>
          ) : (
            airdrops.map(project => (
              <AirdropCard key={project.id} project={project} />
            ))
          )}
        </div>
      </section>
      
      {/* Footer / Join Newsletter */}
      <footer className="footer-section notion-card">
        <h2>{t('home.footer_title')}</h2>
        <p className="text-muted">{t('home.footer_desc')}</p>
        <a href="https://t.me/your_telegram_group" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          {t('home.footer_btn')}
        </a>
      </footer>
    </div>
  );
}

export default Home;

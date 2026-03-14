import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Sun, Moon, Globe } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('id') ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '12px 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: 'var(--bg-main)',
      borderBottom: '1px solid var(--border-color)',
      fontFamily: 'inherit'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>
        <span style={{ fontSize: '18px' }}>📄</span>
        <span>Duta Airdrop</span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button 
          onClick={toggleLanguage} 
          className="btn-secondary"
          style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '4px', border: 'none' }}
          title="Change Language"
        >
          <Globe size={16} /> {i18n.language.startsWith('en') ? 'EN' : 'ID'}
        </button>

        <button 
          onClick={toggleTheme} 
          className="btn-secondary"
          style={{ padding: '6px 8px', border: 'none' }}
          title="Toggle Light/Dark Mode"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <Link to="/login" className="btn-secondary" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          textDecoration: 'none',
          padding: '6px 8px',
          border: 'none',
          marginLeft: '4px'
        }}>
          <LogIn size={16} />
          <span>{t('nav.admin')}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

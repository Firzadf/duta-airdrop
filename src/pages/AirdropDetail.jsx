import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './AirdropDetail.css';

function AirdropDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  async function fetchProject() {
    try {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center text-muted" style={{ padding: '60px', textAlign: 'center' }}>
        <h2>{t('home.loading')}</h2>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center text-muted" style={{ padding: '60px', textAlign: 'center' }}>
        <h2>{t('detail.not_found')}</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>{t('detail.back_home')}</Link>
      </div>
    );
  }

  const tutorialSteps = project.tutorial_steps || [];

  const toggleStep = (index) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const progress = tutorialSteps.length > 0 
    ? Math.round((completedSteps.length / tutorialSteps.length) * 100) 
    : 0;

  return (
    <div className="airdrop-detail-page">
      <Link to="/" className="back-link text-muted">
        <ArrowLeft size={16} /> {t('detail.back')}
      </Link>

      <div className="notion-page-header">
        {project.banner_image_url && (
          <img src={project.banner_image_url} alt="Cover" className="page-cover" />
        )}
        <div className="page-header-content">
          {project.logo_image_url && (
            <img src={project.logo_image_url} alt="Icon" className="page-icon-img" />
          )}
          <h1 className="page-title">{project.title}</h1>
          <div className="page-properties">
            <div className="property-row">
              <span className="property-label text-muted">Status</span>
              <span className={`notion-badge status-${project.status.toLowerCase()}`}>{project.status}</span>
            </div>
            <div className="property-row">
              <span className="property-label text-muted">Cost Type</span>
              <span className="notion-badge status-default">{project.cost_type}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-content-grid">
        <div className="main-tutorial">
          <div className="page-blocks">
            <h3 style={{ marginBottom: '8px' }}>Description</h3>
            <p className="page-description">
              {project.description}
            </p>
            
            <hr className="notion-divider" />

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', marginBottom: '16px' }}>
              <ShieldCheck color="var(--text-main)" size={20} /> 
              {t('detail.guide_title')}
            </h3>

            {tutorialSteps.length > 0 ? (
              <>
                <div className="progress-container">
                  <div className="progress-header text-muted">
                    <span>{t('detail.progress')}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar-bg notion-progress-bg">
                    <div className="progress-bar-fill notion-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="notion-checklist">
                  {tutorialSteps.map((step, index) => {
                    const isCompleted = completedSteps.includes(index);
                    return (
                      <div 
                        key={index} 
                        className="notion-checkbox-block"
                        onClick={() => toggleStep(index)}
                      >
                        <div className={`notion-checkbox ${isCompleted ? 'checked' : ''}`}>
                          {isCompleted && <CheckCircle2 size={14} color="var(--bg-main)" />}
                        </div>
                        <div className={`notion-checkbox-text ${isCompleted ? 'text-muted' : ''}`} style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
                          <p>{step}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-muted" style={{ fontStyle: 'italic' }}>{t('detail.no_steps')}</p>
            )}
          </div>
        </div>

        <div className="sidebar">
          <div className="notion-card action-card">
            <h4 style={{ marginBottom: '8px' }}>🚀 {t('detail.action_title')}</h4>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
              {t('detail.action_desc')}
            </p>
            {project.referral_link ? (
              <a href={project.referral_link} target="_blank" rel="noreferrer" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                {t('detail.btn_ref')} <ExternalLink size={18} />
              </a>
            ) : (
              <button disabled className="btn-secondary" style={{ width: '100%', cursor: 'not-allowed' }}>{t('detail.btn_no_ref')}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirdropDetail;

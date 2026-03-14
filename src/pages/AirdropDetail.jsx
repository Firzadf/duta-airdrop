import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, ShieldCheck, Share2, MessageSquare, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './AirdropDetail.css';

function AirdropDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchComments();
  }, [id]);

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('airdrop_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  }

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          { airdrop_id: id, username: newCommentName, content: newCommentText }
        ]);

      if (error) throw error;
      
      // Reset form and refetch
      setNewCommentName('');
      setNewCommentText('');
      fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err.message);
      alert('Failed to post comment. Ensure you have run the database.sql update!');
    } finally {
      setSubmittingComment(false);
    }
  };

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
            
            {project.network && (
              <div className="property-row">
                <span className="property-label text-muted">Network</span>
                <span>{project.network}</span>
              </div>
            )}
            
            {project.funded && (
              <div className="property-row">
                <span className="property-label text-muted">Funded / MC</span>
                <span>{project.funded}</span>
              </div>
            )}
            
            {project.supply && (
              <div className="property-row">
                <span className="property-label text-muted">Airdrop Supply</span>
                <span>{project.supply}</span>
              </div>
            )}
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

            {/* Discussion Board */}
            <hr className="notion-divider" style={{ marginTop: '48px' }} />
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MessageSquare color="var(--text-main)" size={20} /> 
              Discussion Server
            </h3>

            <div className="notion-comments-section">
              <form onSubmit={handlePostComment} className="comment-form notion-card" style={{ padding: '16px', marginBottom: '24px' }}>
                <input 
                  type="text" 
                  placeholder="Your Name (e.g. Satoshi)" 
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', borderRadius: '4px' }}
                />
                <textarea 
                  placeholder="Share your progress or ask a question..." 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                  rows="3"
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', borderRadius: '4px', resize: 'vertical' }}
                />
                <button type="submit" className="btn-primary" disabled={submittingComment} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px' }}>
                  <Send size={14} /> {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>

              <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {comments.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: '14px' }}>Become the first astronaut to leave a mark here.</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-item" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                          {comment.username.charAt(0).toUpperCase()}
                        </div>
                        <strong style={{ fontSize: '14px' }}>{comment.username}</strong>
                        <span className="text-muted" style={{ fontSize: '12px' }}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', lineHeight: '1.5', paddingLeft: '32px' }}>{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="sidebar">
          <div className="notion-card action-card">
            <h4 style={{ marginBottom: '8px' }}>🚀 {t('detail.action_title')}</h4>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
              {t('detail.action_desc')}
            </p>
            {project.referral_link ? (
              <a href={project.referral_link} target="_blank" rel="noreferrer" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {t('detail.btn_ref')} <ExternalLink size={16} />
              </a>
            ) : (
              <button disabled className="btn-secondary" style={{ width: '100%', cursor: 'not-allowed', marginBottom: '8px' }}>{t('detail.btn_no_ref')}</button>
            )}
            <button onClick={handleShare} className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              Share Link <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirdropDetail;

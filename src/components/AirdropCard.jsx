import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './AirdropCard.css';

function AirdropCard({ project }) {
  const { t } = useTranslation();
  
  return (
    <Link to={`/airdrop/${project.id}`} className="notion-card airdrop-card" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
      <div className="card-image-container">
        <img src={project.banner_image_url} alt={`${project.title} Banner`} className="card-banner" />
        <div className="card-logo-container">
          <img src={project.logo_image_url} alt={`${project.title} Logo`} className="card-logo" />
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-description text-muted">{project.description.substring(0, 100)}...</p>
        
        <div className="card-meta">
          <span className={`notion-badge status-${project.status.toLowerCase()}`}>
            {project.status}
          </span>
          <span className="notion-badge status-default">{project.cost_type}</span>
        </div>
      </div>
    </Link>
  );
}

export default AirdropCard;

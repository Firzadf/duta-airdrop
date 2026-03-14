import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Dummy logic for now before Supabase integration
    setTimeout(() => {
      if (email === 'admin@duta.com' && password === 'admin123') {
        navigate('/admin');
      } else {
        setError('Email atau password salah! (Coba admin@duta.com / admin123)');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="notion-card" style={{ padding: '48px 32px', width: '100%', maxWidth: '400px', margin: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Lock size={40} color="var(--text-main)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontFamily: 'Lora, serif', marginBottom: '8px' }}>Admin Login</h2>
          <p className="text-muted" style={{ fontSize: '14px' }}>Access your workspace.</p>
        </div>

        {error && (
          <div style={{ background: 'var(--status-ended-bg)', border: '1px solid var(--status-ended-text)', color: 'var(--status-ended-text)', padding: '12px', borderRadius: '4px', marginBottom: '24px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '36px' }}
                placeholder="admin@duta.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '36px' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '10px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Authenticating...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

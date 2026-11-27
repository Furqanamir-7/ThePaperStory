import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthGuard';
import { useAdminData } from '../AdminDataContext';
import '../admin.css';

export default function LoginPage() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('tps_admin_current_user') || 'FURQAN';
  });
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, checkRateLimit, recordFailedAttempt, isAuthenticated } = useAdminAuth();
  const { verifyAdminCredentials, verifyPassword, allowedAdmins = ['TPS', 'FURQAN', 'MAHIN'] } = useAdminData();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check rate limit (max 5 attempts / 15m)
    const { locked, waitMin } = checkRateLimit();
    if (locked) {
      setError(`Too many failed attempts. Account locked. Please wait ${waitMin} minutes.`);
      return;
    }

    if (!username) {
      setError('Please choose an admin profile (TPS, FURQAN, or MAHIN).');
      return;
    }

    if (!password) {
      setError('Please enter your admin password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const check = verifyAdminCredentials
        ? verifyAdminCredentials(username, password)
        : (verifyPassword(password) ? { ok: true, username } : { ok: false, error: 'Incorrect admin password.' });

      if (check.ok) {
        login(check.username || username, remember);
        navigate('/admin');
      } else {
        recordFailedAttempt();
        setError(check.error || 'Incorrect admin password. Please try again.');
        setIsLoading(false);
      }
    }, 350);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFF9F5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: '0 8px 30px rgba(166, 35, 65, 0.08)',
        border: '1px solid #EADBDD'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/logo.png"
            alt="The Paper Story"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'contain',
              margin: '0 auto 14px',
              display: 'block',
              boxShadow: '0 4px 16px rgba(166, 35, 65, 0.15)',
            }}
          />
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#2B1B1F', margin: '0 0 6px', fontFamily: 'serif' }}>
            The Paper Story
          </h1>
          <p style={{ fontSize: '13px', color: '#7A6A6E', margin: 0 }}>
            Management Portal — Sign in to continue
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FFEBEE',
            border: '1px solid #FFCDD2',
            color: '#B3261E',
            padding: '12px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Admin Profile Selector */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2B1B1F', marginBottom: '8px' }}>
              Select Admin Account
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {allowedAdmins.map((user) => {
                const isSelected = username === user;
                return (
                  <button
                    key={user}
                    type="button"
                    onClick={() => {
                      setUsername(user);
                      setError('');
                    }}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #A62341' : '1px solid #EADBDD',
                      backgroundColor: isSelected ? '#FFF5F6' : '#FFFFFF',
                      color: isSelected ? '#A62341' : '#4B3B3F',
                      fontWeight: isSelected ? '700' : '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(166, 35, 65, 0.12)' : 'none',
                    }}
                  >
                    👤 {user}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2B1B1F', marginBottom: '8px' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #EADBDD',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#7A6A6E'
                }}
              >
                {showPass ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7A6A6E', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ accentColor: '#A62341' }}
              />
              Keep me signed in (30 days)
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#A62341',
              color: '#FFFFFF',
              border: 'none',
              padding: '13px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isLoading ? 'default' : 'pointer',
              opacity: isLoading ? 0.8 : 1,
              transition: 'background 0.2s ease'
            }}
          >
            {isLoading ? 'Verifying...' : 'Sign in to Admin'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a
            href="/"
            style={{ fontSize: '13px', color: '#A62341', textDecoration: 'none', fontWeight: '500' }}
          >
            ← Return to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}


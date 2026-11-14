import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthGuard';
import { useAdminData } from '../AdminDataContext';
import '../admin.css';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, checkRateLimit, recordFailedAttempt } = useAdminAuth();
  const { verifyPassword } = useAdminData();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check rate limit (max 5 attempts / 15m)
    const { locked, waitMin } = checkRateLimit();
    if (locked) {
      setError(`Too many failed attempts. Account locked. Please wait ${waitMin} minutes.`);
      return;
    }

    if (!password) {
      setError('Please enter the admin password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (verifyPassword(password)) {
        login(remember);
        navigate('/admin');
      } else {
        recordFailedAttempt();
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
      }
    }, 400);
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
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2B1B1F', marginBottom: '8px' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (e.g. TPS-786)"
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


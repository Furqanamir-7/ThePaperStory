import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);
const SESSION_KEY = 'tps_admin_auth_token';
const ADMIN_USER_KEY = 'tps_admin_current_user';
const LAST_ACTIVITY_KEY = 'tps_admin_last_activity';
const RATE_LIMIT_KEY = 'tps_admin_login_attempts';
const REMEMBER_KEY = 'tps_admin_remember_me';
const LOGIN_TIME_KEY = 'tps_admin_login_time';

const REMEMBER_TIMEOUT_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SESSION_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours

export function AdminAuthProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    return localStorage.getItem(ADMIN_USER_KEY) || sessionStorage.getItem(ADMIN_USER_KEY) || 'TPS';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const isRemembered = localStorage.getItem(REMEMBER_KEY) === 'true';
    const token = isRemembered
      ? (localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY))
      : (sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY));

    if (!token) return false;

    const loginTime = parseInt(localStorage.getItem(LOGIN_TIME_KEY) || '0', 10);
    const lastActive = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);
    const now = Date.now();

    if (isRemembered) {
      // 30 days persistence: valid across tab closures and browser restarts
      const refTime = loginTime || lastActive;
      if (refTime && (now - refTime > REMEMBER_TIMEOUT_MS)) {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(ADMIN_USER_KEY);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        localStorage.removeItem(REMEMBER_KEY);
        localStorage.removeItem(LOGIN_TIME_KEY);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        return false;
      }
      localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
      return true;
    }

    // Non-remembered session: expires if inactive for over 12 hours
    if (lastActive && (now - lastActive > SESSION_TIMEOUT_MS)) {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(ADMIN_USER_KEY);
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      return false;
    }

    return true;
  });

  // Track activity (throttled to avoid main-thread blocking on every mouse movement)
  useEffect(() => {
    if (!isAuthenticated) return;

    let lastWrite = 0;
    const updateActivity = () => {
      const now = Date.now();
      if (now - lastWrite > 10000) {
        lastWrite = now;
        try {
          localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
        } catch (e) {}
      }
    };

    updateActivity();

    // Idle logout only applies when "Keep me signed in" is FALSE
    const interval = setInterval(() => {
      const isRemembered = localStorage.getItem(REMEMBER_KEY) === 'true';
      if (!isRemembered) {
        const lastActive = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);
        if (Date.now() - lastActive > SESSION_TIMEOUT_MS) {
          logout();
        }
      }
    }, 60000);

    window.addEventListener('mousemove', updateActivity, { passive: true });
    window.addEventListener('keydown', updateActivity, { passive: true });
    window.addEventListener('click', updateActivity, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, [isAuthenticated]);

  const checkRateLimit = () => {
    try {
      const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
      const now = Date.now();
      const recent = attempts.filter((ts) => now - ts < 15 * 60 * 1000);
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
      if (recent.length >= 5) {
        const oldest = recent[0];
        const waitMin = Math.ceil((15 * 60 * 1000 - (now - oldest)) / 60000);
        return { locked: true, waitMin };
      }
      return { locked: false };
    } catch {
      return { locked: false };
    }
  };

  const recordFailedAttempt = () => {
    try {
      const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
      attempts.push(Date.now());
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(attempts));
    } catch {}
  };

  const clearRateLimit = () => {
    localStorage.removeItem(RATE_LIMIT_KEY);
  };

  const login = (username = 'TPS', remember = false) => {
    const token = 'tps_auth_' + Date.now();
    const cleanUser = String(username).trim().toUpperCase();
    const now = String(Date.now());
    setCurrentAdmin(cleanUser);

    if (remember) {
      localStorage.setItem(SESSION_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, cleanUser);
      localStorage.setItem(REMEMBER_KEY, 'true');
      localStorage.setItem(LOGIN_TIME_KEY, now);
      localStorage.setItem(LAST_ACTIVITY_KEY, now);
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(ADMIN_USER_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, token);
      sessionStorage.setItem(ADMIN_USER_KEY, cleanUser);
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.setItem(LOGIN_TIME_KEY, now);
      localStorage.setItem(LAST_ACTIVITY_KEY, now);
    }
    clearRateLimit();
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(LOGIN_TIME_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentAdmin, login, logout, checkRateLimit, recordFailedAttempt }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

export function AdminAuthGuard({ children }) {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}


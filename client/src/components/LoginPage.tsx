import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import './LoginPage.css';

type LocalUser = { name: string; isLocal: boolean };

type Props = {
  onLocalLogin: (user: LocalUser) => void;
};

export default function LoginPage({ onLocalLogin }: Props) {
  const { instance } = useMsal();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleMicrosoftLogin = () => instance.loginRedirect(loginRequest);

  const handleLocalLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Identifiants incorrects');
      } else {
        sessionStorage.setItem('localToken', data.token);
        onLocalLogin({ name: data.name, isLocal: true });
      }
    } catch {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="21" height="21" fill="#F25022"/>
            <rect x="25" y="2" width="21" height="21" fill="#7FBA00"/>
            <rect x="2" y="25" width="21" height="21" fill="#00A4EF"/>
            <rect x="25" y="25" width="21" height="21" fill="#FFB900"/>
          </svg>
        </div>
        <h1 className="login-title">Time Tracker</h1>

        <button className="login-btn microsoft-btn" onClick={handleMicrosoftLogin}>
          <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Se connecter avec Microsoft
        </button>

        <div className="login-divider"><span>ou</span></div>

        <form onSubmit={handleLocalLogin} className="local-form">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            autoComplete="current-password"
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn local-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Connexion locale'}
          </button>
        </form>
      </div>
    </div>
  );
}

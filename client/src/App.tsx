import './App.css';
import { useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import TimeTracker from './TimeTracker';
import LoginPage from './components/LoginPage';

const msalInstance = new PublicClientApplication(msalConfig);

type LocalUser = { name: string; isLocal: boolean };

function AppContent() {
  const { accounts } = useMsal();
  const msalAuthenticated = accounts.length > 0;

  const [localUser, setLocalUser] = useState<LocalUser | null>(() => {
    const stored = sessionStorage.getItem('localUser');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLocalLogin = (user: LocalUser) => {
    sessionStorage.setItem('localUser', JSON.stringify(user));
    setLocalUser(user);
  };

  const handleLocalLogout = () => {
    sessionStorage.removeItem('localUser');
    sessionStorage.removeItem('localToken');
    setLocalUser(null);
  };

  const isAuthenticated = msalAuthenticated || !!localUser;

  return (
    <div className="App">
      {isAuthenticated ? (
        <TimeTracker localUser={localUser} onLocalLogout={handleLocalLogout} />
      ) : (
        <LoginPage onLocalLogin={handleLocalLogin} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AppContent />
    </MsalProvider>
  );
}

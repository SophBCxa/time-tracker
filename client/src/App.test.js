import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('@azure/msal-browser', () => ({
  PublicClientApplication: jest.fn().mockImplementation(() => ({})),
  InteractionRequiredAuthError: class extends Error {},
}));

jest.mock('@azure/msal-react', () => ({
  MsalProvider: ({ children }) => children,
  useMsal: () => ({ instance: { logoutRedirect: jest.fn(), loginRedirect: jest.fn() }, accounts: [] }),
}));

test('affiche la page de connexion quand non authentifie', () => {
  render(<App />);
  expect(screen.getByText(/Se connecter avec Microsoft/i)).toBeInTheDocument();
});

test('affiche le formulaire de connexion locale', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/Nom d'utilisateur/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument();
});

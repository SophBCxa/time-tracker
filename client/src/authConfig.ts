// 🔧 Remplacer ces valeurs par celles de votre App Registration Azure AD
const CLIENT_ID = 'VOTRE_CLIENT_ID_ICI';       // Application (client) ID
const TENANT_ID = 'VOTRE_TENANT_ID_ICI';       // Directory (tenant) ID

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage' as const,
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};

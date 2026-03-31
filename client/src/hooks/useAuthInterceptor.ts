import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from '../authConfig';
import api from '../services/api';

export function useAuthInterceptor(): void {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      if (!accounts[0]) {
        const localToken = sessionStorage.getItem('localToken');
        if (localToken) config.headers.Authorization = `Bearer ${localToken}`;
        return config;
      }
      try {
        const result = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        config.headers.Authorization = `Bearer ${result.accessToken}`;
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          instance.loginRedirect(loginRequest);
        }
      }
      return config;
    });

    return () => { api.interceptors.request.eject(interceptor); };
  }, [instance, accounts]);
}

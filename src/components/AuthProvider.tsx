import React, { useEffect } from 'react';
import { AuthProvider as PKCEAuthProvider, useAuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { authConfig } from '../config/authConfig';

interface AuthProviderProps {
  children: React.ReactNode;
}

const ReduxSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, tokenData, idTokenData } = useAuthContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      // Syncing the OAuth2 context data to our Redux store
      dispatch(setCredentials({
        userId: idTokenData?.sub || tokenData?.sub || '',
        profile: {
          username: tokenData?.preferred_username || idTokenData?.preferred_username,
          email: tokenData?.email || idTokenData?.email,
          firstName: tokenData?.given_name || idTokenData?.given_name,
          lastName: tokenData?.family_name || idTokenData?.family_name,
        },
        token: token,
      }));
    }
  }, [token, tokenData, idTokenData, dispatch]);

  return <>{children}</>;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <PKCEAuthProvider authConfig={authConfig as any}>
      <ReduxSync>
        {children}
      </ReduxSync>
    </PKCEAuthProvider>
  );
};

export default AuthProvider;
export { useAuthContext };

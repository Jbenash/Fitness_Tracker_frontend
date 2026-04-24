const KEYCLOAK_BASE = import.meta.env.VITE_KEYCLOAK_URL;
const REALM = import.meta.env.VITE_KEYCLOAK_REALM;

export const authConfig = {
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  authorizationEndpoint: `${KEYCLOAK_BASE}/realms/${REALM}/protocol/openid-connect/auth`,
  tokenEndpoint: `${KEYCLOAK_BASE}/realms/${REALM}/protocol/openid-connect/token`,
  logoutEndpoint: `${KEYCLOAK_BASE}/realms/${REALM}/protocol/openid-connect/logout`,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  postLogoutRedirectUri: window.location.origin + '/',
  scope: 'openid profile email offline_access',
  onRefreshTokenExpire: (event: any) => {
    console.log("Session expired, logging in...", event);
    window.location.reload();
  },
};

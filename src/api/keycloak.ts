import Keycloak from 'keycloak-js';
import { authConfig } from '../config/authConfig';

// Extracting base values from the explicit endpoints for keycloak-js compatibility
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ,
  realm: import.meta.env.VITE_KEYCLOAK_REALM ,
  clientId: authConfig.clientId, 
});

export default keycloak;

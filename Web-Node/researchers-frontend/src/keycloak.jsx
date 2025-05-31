import Keycloak from "keycloak-js"

const keycloakConfig = {
  url: `${import.meta.env.VITE_KEYCLOAK_BASE_URL}`,
  realm: "web-server",
  clientId: "app-client",
}

const keycloak = new Keycloak(keycloakConfig)

export default keycloak

import React, { useEffect, useState } from "react"
import { useKeycloak } from "@react-keycloak/web"

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { keycloak, initialized } = useKeycloak()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!initialized) return

    if (!keycloak.authenticated) {
      keycloak.login()
      return
    }

    if (keycloak.tokenParsed?.sub) {
      localStorage.setItem("patientId", keycloak.tokenParsed.sub)
    }

    if (keycloak.hasRealmRole("user")) {
      keycloak.logout({ redirectUri: window.location.origin })
      return
    }

    if (keycloak.hasRealmRole("admin")) {
      keycloak.logout({ redirectUri: window.location.origin })
      return
    }
    const hasAllowed = allowedRoles.some((r) => keycloak.hasRealmRole(r))
    if (!hasAllowed) {
      keycloak.logout({ redirectUri: window.location.origin })
      return
    }
    setAuthorized(true)
  }, [initialized, keycloak, allowedRoles])

  if (!initialized || !authorized) {
    return null
  }

  return <>{children}</>
}

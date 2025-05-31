import React, { useMemo } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material"
import "./index.css"
import keycloak from "./keycloak.jsx"
import { ReactKeycloakProvider } from "@react-keycloak/web"

const getDesignTokens = () => ({
  palette: {
    primary: {
      main: "rgb(55, 66, 73)",
    },
    secondary: {
      main: "rgb(56, 67, 82)",
    },
    background: {
      default: "rgb(245, 245, 245)",
      secondary: "rgb(226, 228, 231)",
    },
    text: {
      primary: "rgb(55, 66, 73)",
      secondary: "rgb(55, 66, 73)",
    },
  },
})

function Main() {
  const theme = useMemo(() => createTheme(getDesignTokens()))

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "login-required",
        checkLoginIframe: false,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ReactKeycloakProvider>
  )
}

createRoot(document.getElementById("root")).render(<Main />)

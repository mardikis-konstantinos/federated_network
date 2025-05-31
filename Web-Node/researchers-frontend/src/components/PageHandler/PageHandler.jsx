import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useKeycloak } from "@react-keycloak/web"
import "./PageHandler.css"
import HubIcon from "@mui/icons-material/Hub"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import LogoutIcon from "@mui/icons-material/Logout"
import QuizIcon from "@mui/icons-material/Quiz"

export default function PageHandler() {
  const { keycloak, initialized } = useKeycloak()
  if (!initialized) return null

  const isAdmin = keycloak.hasRealmRole("admin")
  const handleLogout = () =>
    keycloak.logout({ redirectUri: window.location.origin })

  return (
    <div className="page-handler-container">
      <div className="page-handler-header">
        <div className="page-handle-logo">Researchers App</div>
        <div className="page-handler-header-actions">
          <NavLink
            to="queries"
            className={({ isActive }) =>
              isActive ? "active page-handler-btn" : "page-handler-btn"
            }
          >
            <QuizIcon />
            <span className="btn-text">Queries</span>
          </NavLink>

          <NavLink
            to="nodes"
            className={({ isActive }) =>
              isActive ? "page-handler-btn active" : "page-handler-btn"
            }
          >
            <HubIcon />
            <span className="btn-text">Nodes</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="manage-users"
              className={({ isActive }) =>
                isActive ? "active page-handler-btn" : "page-handler-btn"
              }
            >
              <ManageAccountsIcon />
              <span className="btn-text">Manage Users</span>
            </NavLink>
          )}

          <div
            type="button"
            className="page-handler-btn"
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span className="btn-text">Logout</span>
          </div>
        </div>
      </div>

      <div className="page-handler-content">
        <Outlet />
      </div>
    </div>
  )
}

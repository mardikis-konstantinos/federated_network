import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useKeycloak } from "@react-keycloak/web"
import "./PageHandler.css"

import UploadIcon from "@mui/icons-material/Upload"
import TableViewIcon from "@mui/icons-material/TableView"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import LogoutIcon from "@mui/icons-material/Logout"

export default function PageHandler() {
  const { keycloak, initialized } = useKeycloak()
  if (!initialized) return null

  const isAdmin = keycloak.hasRealmRole("admin")
  const handleLogout = () =>
    keycloak.logout({ redirectUri: window.location.origin })

  return (
    <div className="page-handler-container">
      <div className="page-handler-header">
        <div className="page-handle-logo">Medical Staff App</div>
        <div className="page-handler-header-actions">
          <NavLink
            to="upload"
            className={({ isActive }) =>
              isActive ? "active page-handler-btn" : "page-handler-btn"
            }
          >
            <UploadIcon />
            <span className="btn-text">Upload</span>
          </NavLink>

          <NavLink
            to="view"
            className={({ isActive }) =>
              isActive ? "page-handler-btn active" : "page-handler-btn"
            }
          >
            <TableViewIcon />
            <span className="btn-text">View Data</span>
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

          {/* Logout button */}
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

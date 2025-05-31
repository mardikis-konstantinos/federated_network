import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useKeycloak } from "@react-keycloak/web"
import "./Nodes.css"
import HubIcon from "@mui/icons-material/Hub"
import EditIcon from "@mui/icons-material/Edit"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import SourceIcon from "@mui/icons-material/Source"

import SettingsIcon from "@mui/icons-material/Settings"
export default function Nodes() {
  const { keycloak, initialized } = useKeycloak()
  if (!initialized) return null

  const isAdmin = keycloak.hasRealmRole("admin")

  return (
    <div className="nodes-container">
      <div className="nodes-header">
        <div className="nodes-header-actions">
          <NavLink
            to="metadata"
            className={({ isActive }) =>
              isActive ? "nodes-btn active" : "nodes-btn"
            }
          >
            <SourceIcon />
            <span className="btn-text">Metadata</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="settings-node"
              className={({ isActive }) =>
                isActive ? "active nodes-btn" : "nodes-btn"
              }
            >
              <SettingsIcon />
              <span className="btn-text">Μanagement</span>
            </NavLink>
          )}
        </div>
      </div>

      <div className="nodes-content">
        <Outlet />
      </div>
    </div>
  )
}

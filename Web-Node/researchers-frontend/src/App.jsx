import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import PageHandler from "./components/PageHandler/PageHandler"
import Queries from "./Queries/Queries"
import ManageUsersPage from "./ManageUsersPage/ManageUsersPage"
import Nodes from "./Nodes/Nodes"
import "./App.css"
import Management from "./Management/Management"
import Metadata from "./Metadata/Metadata"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <PageHandler />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="queries" replace />} />

          <Route path="queries" element={<Queries />} />
          <Route path="nodes" element={<Nodes />}>
            <Route index element={<Navigate to="metadata" replace />} />
            <Route path="metadata" element={<Metadata />} />
            <Route path="settings-node" element={<Management />} />
          </Route>

          <Route
            path="manage-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsersPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

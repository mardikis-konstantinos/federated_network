import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import PageHandler from "./components/PageHandler/PageHandler"
import UploadPage from "./UploadPage/UploadPage"
import ViewData from "./ViewData/ViewData"
import ManageUsersPage from "./ManageUsersPage/ManageUsersPage"
import "./App.css"
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
          <Route index element={<Navigate to="upload" replace />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="view" element={<ViewData />} />
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

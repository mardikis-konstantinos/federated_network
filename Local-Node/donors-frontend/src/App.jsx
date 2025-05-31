import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import ConsentPage from "./ConsentPage/ConsentPage"
import "./App.css"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ConsentPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="consent" replace />} />
          <Route path="consent" element={<ConsentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

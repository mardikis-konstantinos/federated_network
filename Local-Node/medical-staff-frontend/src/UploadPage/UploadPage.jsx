import React, { useState } from "react"
import "./UploadPage.css"
import FormPatient from "../components/FormPatient/FormPatient"
import UploadExcel from "../components/UploadExcel/UploadExcel"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import { Box, Button, Typography } from "@mui/material"
import { useSnackbar } from "notistack"

export default function UploadPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    consent: "yes",
  })
  const [excelFile, setExcelFile] = useState(null)

  const isFormComplete = Object.values(patientData).every((v) => v !== "")
  const canConfirm = isFormComplete && excelFile

  const handleConfirm = async () => {
    const doctorId = localStorage.getItem("userId")
    console.log("Doctor ID:", doctorId)
    const formData = new FormData()
    formData.append("firstName", patientData.firstName)
    formData.append("lastName", patientData.lastName)
    formData.append("email", patientData.email)
    formData.append("consent", patientData.consent)
    formData.append("doctor_id", doctorId)
    formData.append("file", excelFile)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL_BACKEND_URL}upload/excel`,
        {
          method: "POST",
          body: formData,
        }
      )
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }
      const result = await response.json()
      enqueueSnackbar(`Upload successful! Patient ID: ${result.patient_id}`, {
        variant: "success",
      })

      setPatientData({ firstName: "", lastName: "", email: "", consent: "yes" })
      setExcelFile(null)
    } catch (err) {
      console.error(err)
      enqueueSnackbar(`Upload failed: ${err.message}`, { variant: "error" })
    }
  }
  return (
    <div className="upload-container">
      <div className="upload-form-new-patient">
        <div className="title-upload-new-patient">
          <PersonAddIcon />
          New Patient
        </div>
        <FormPatient values={patientData} onChange={setPatientData} />
      </div>

      <div className="upload-excel">
        <UploadExcel onFileAccepted={setExcelFile} />
        {excelFile && (
          <p style={{ marginTop: 16 }}>
            Selected file: <strong>{excelFile.name}</strong>
          </p>
        )}
      </div>

      <div className="confirm-to-upload">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirm}
          className="confirm-btn"
        >
          Confirm Upload
        </button>
      </div>
    </div>
  )
}

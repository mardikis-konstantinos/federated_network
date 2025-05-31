import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  Stack,
} from "@mui/material"
import { useSnackbar } from "notistack"
import LogoutIcon from "@mui/icons-material/Logout"
import "./ConsentPage.css"
import { useKeycloak } from "@react-keycloak/web"
export default function ConsentPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [consent, setConsent] = useState("")
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  const patientId = localStorage.getItem("patientId")
  const { keycloak, initialized } = useKeycloak()
  const handleLogout = () =>
    keycloak.logout({ redirectUri: window.location.origin })
  if (!initialized) return null

  useEffect(() => {
    if (!patientId) return
    setLoading(true)
    fetch(
      `${import.meta.env.VITE_LOCAL_BACKEND_URL}consents/patients/${patientId}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((data) => setConsent(data.consent))
      .catch((err) =>
        enqueueSnackbar(`Failed to load consent: ${err.message}`, {
          variant: "error",
        })
      )
      .finally(() => setLoading(false))
  }, [patientId, enqueueSnackbar])

  const handleChange = (e) => setConsent(e.target.value)

  const handleUpdate = async () => {
    if (!patientId) return
    setUpdating(true)
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_LOCAL_BACKEND_URL
        }consents/change/${patientId}?new_consent=${consent}`
      )
      if (!res.ok) throw new Error(await res.text())
      const result = await res.json()
      enqueueSnackbar(`Consent ${result.status}`, { variant: "success" })
    } catch (err) {
      enqueueSnackbar(`Update failed: ${err.message}`, { variant: "error" })
    } finally {
      setUpdating(false)
    }
  }

  if (!patientId)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        No patient ID found in storage.
      </Typography>
    )

  return (
    <div className="consent-page">
      <div className="consent-logout-btn" onClick={handleLogout}>
        <LogoutIcon />
        <span className="btn-text">Logout</span>
      </div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Paper
          elevation={4}
          sx={{ p: 5, maxWidth: 600, width: "100%", borderRadius: 4 }}
        >
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Data‑Sharing Consent
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8 }}
            >
              We strive to advance medical science.{" "}
              <strong>Your pseudonymised health data</strong> may be reused{" "}
              <em>exclusively for ethical, peer‑reviewed research</em>. If you
              select <strong>No</strong>, none of your personal information will
              ever be included in these studies. You can change your preference
              whenever you wish, your choice will be respected instantly and
              retroactively in all future analyses.
            </Typography>

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 650 }}>
                Allow secondary use of my data
              </FormLabel>
              <RadioGroup
                row
                value={consent}
                onChange={handleChange}
                sx={{ mt: 1, justifyContent: "center" }}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              onClick={handleUpdate}
              disabled={loading || updating || consent === ""}
              sx={{ px: 6, py: 1.5, borderRadius: 3 }}
            >
              {updating ? "Updating…" : "Save Preference"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </div>
  )
}

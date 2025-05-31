import React, { useEffect, useState } from "react"
import { DataGrid } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"
import { useSnackbar } from "notistack"

export default function ViewData() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_LOCAL_BACKEND_URL}pseudo/data`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((data) => setRows(data.pseudonymized_records || []))
      .catch((err) =>
        enqueueSnackbar(`Load failed: ${err.message}`, { variant: "error" })
      )
      .finally(() => setLoading(false))
  }, [])

  const columns = rows[0]
    ? Object.keys(rows[0]).map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
      }))
    : []

  return (
    <Box p={2} height="100%">
      <Typography variant="h5" gutterBottom>
        Records
      </Typography>
      <Box sx={{ flex: 1, height: "calc(100vh - 150px)" }} width="100%">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.pseudonym_id}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Box>
    </Box>
  )
}

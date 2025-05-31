import React, { useEffect, useState } from "react"
import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Paper,
  Chip,
  Autocomplete,
  Divider,
  useTheme,
} from "@mui/material"
import { useSnackbar } from "notistack"

const OPERATORS = [
  { label: ">", value: "gt" },
  { label: ">=", value: "gte" },
  { label: "<", value: "lt" },
  { label: "<=", value: "lte" },
  { label: "=", value: "eq" },
]

export default function Queries() {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()

  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState([])
  const [query, setQuery] = useState({ field: "", op: "gt", value: "" })
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)

  const hiddenFields = [
    "pseudonym_id",
    "upload_id",
    "original_id",
    "Gender",
    "Blood_Type",
    "Blood_Pressure (mmHg)",
  ]

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${import.meta.env.VITE_WEB_BACKEND_URL}nodes/get`
        )
        const nodesJson = await res.json()
        setNodes(nodesJson)

        for (const n of nodesJson) {
          try {
            const metaRes = await fetch(`${n.url}/node/metadata/${n.node_id}`)
            if (!metaRes.ok) continue
            const meta = await metaRes.json()
            const list = Object.keys(meta.stats || {}).filter(
              (k) => !hiddenFields.includes(k)
            )
            if (list.length) {
              setFields(list)
              break
            }
          } catch (_) {}
        }
      } catch (_) {
        enqueueSnackbar("Failed to load nodes", { variant: "error" })
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [enqueueSnackbar])

  const handleRun = async () => {
    if (!query.field || query.value === "") return
    setRunning(true)
    setResults(null)
    try {
      const promises = nodes.map(async (node) => {
        try {
          const url = `${node.url}/node/query?field=${encodeURIComponent(
            query.field
          )}&op=${query.op}&value=${encodeURIComponent(query.value)}`
          const resp = await fetch(url)
          if (!resp.ok) throw new Error()
          const json = await resp.json()
          return { name: node.name, count: json.count }
        } catch (_) {
          enqueueSnackbar(`Query failed on ${node.name}`, {
            variant: "warning",
          })
          return { name: node.name, count: 0 }
        }
      })
      const nodeCounts = await Promise.all(promises)
      const total = nodeCounts.reduce((s, r) => s + r.count, 0)
      setResults({ total, nodeCounts })
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: "100%",
        py: 4,
        px: { xs: 2, md: 6 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: theme.palette.background.paper,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="center"
        >
          <Autocomplete
            options={fields}
            value={query.field}
            onChange={(_, val) => setQuery({ ...query, field: val || "" })}
            sx={{ minWidth: 220 }}
            renderInput={(params) => <TextField {...params} label="Field" />}
          />

          <TextField
            select
            label="Operator"
            value={query.op}
            onChange={(e) => setQuery({ ...query, op: e.target.value })}
            sx={{ width: 120 }}
          >
            {OPERATORS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Value"
            type="number"
            value={query.value}
            onChange={(e) => setQuery({ ...query, value: e.target.value })}
            sx={{ width: 160 }}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleRun}
            disabled={running || !query.field || query.value === ""}
            sx={{ px: 4, borderRadius: 2 }}
          >
            {running ? "Running…" : "Run"}
          </Button>
        </Stack>

        {results && (
          <>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" fontWeight={500} gutterBottom>
              Total Matches: {results.total}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {results.nodeCounts.map((r) => (
                <Chip
                  key={r.name}
                  label={`${r.name}: ${r.count}`}
                  color="secondary"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  )
}

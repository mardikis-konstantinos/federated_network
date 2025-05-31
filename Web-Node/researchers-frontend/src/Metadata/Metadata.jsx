import React, { useEffect, useState } from "react"
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useSnackbar } from "notistack"

const renderStatRow = (field, value) => {
  if (typeof value === "object" && "min" in value) {
    return (
      <TableRow key={field}>
        <TableCell>{field}</TableCell>
        <TableCell align="right">{value.min.toFixed(2)}</TableCell>
        <TableCell align="right">{value.mean.toFixed(2)}</TableCell>
        <TableCell align="right">{value.max.toFixed(2)}</TableCell>
      </TableRow>
    )
  }
  if (typeof value === "object") {
    return (
      <TableRow key={field}>
        <TableCell>{field}</TableCell>
        <TableCell colSpan={3}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Object.entries(value).map(([k, v]) => (
              <Chip key={k} label={`${k}: ${v}%`} size="small" />
            ))}
          </Stack>
        </TableCell>
      </TableRow>
    )
  }
  return null
}

export default function Metadata() {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const nodesRes = await fetch(
          `${import.meta.env.VITE_WEB_BACKEND_URL}nodes/get`
        )
        const nodes = await nodesRes.json()

        const results = await Promise.all(
          nodes.map(async (n) => {
            try {
              const metaRes = await fetch(`${n.url}/node/metadata/${n.node_id}`)
              if (!metaRes.ok) throw new Error()
              const meta = await metaRes.json()
              return { node: n, meta }
            } catch {
              enqueueSnackbar(`Failed to fetch metadata for ${n.name}`, {
                variant: "warning",
              })
              return { node: n, meta: null }
            }
          })
        )
        setData(results)
      } catch {
        enqueueSnackbar("Failed to load nodes", { variant: "error" })
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [enqueueSnackbar])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    )
  }

  if (data.length === 0) {
    return (
      <Typography textAlign="center" mt={4}>
        No nodes available.
      </Typography>
    )
  }

  return (
    <Box p={1} bgcolor="background.secondary">
      {data.map(({ node, meta }) => (
        <Accordion key={node.node_id} defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6">{node.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {node.url}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {meta ? (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant="subtitle1">
                    Record Count: {meta.record_count}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated:{" "}
                    {new Date(meta.metadata_updated_at).toLocaleString()}
                  </Typography>

                  <Table size="small" sx={{ mt: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell align="right">Min / Category</TableCell>
                        <TableCell align="right">Mean / %</TableCell>
                        <TableCell align="right">Max</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(meta.stats || {}).map(([field, value]) =>
                        renderStatRow(field, value)
                      )}
                    </TableBody>
                  </Table>
                </Stack>
              </Paper>
            ) : (
              <Typography color="error">No metadata found.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

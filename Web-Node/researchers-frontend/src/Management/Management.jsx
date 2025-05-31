import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { useSnackbar } from "notistack"

export default function Management() {
  const { enqueueSnackbar } = useSnackbar()
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: "", node_id: "", url: "" })

  const fetchNodes = () => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_WEB_BACKEND_URL}nodes/get`)
      .then((res) => res.json())
      .then(setNodes)
      .catch((err) => enqueueSnackbar(err.message, { variant: "error" }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchNodes()
  }, [])

  const handleOpenCreate = () => {
    setEditing(false)
    setForm({ name: "", node_id: "", url: "" })
    setDialogOpen(true)
  }

  const handleOpenEdit = (row) => {
    setEditing(true)
    setForm({ ...row })
    setDialogOpen(true)
  }

  const handleDelete = async (node_id) => {
    if (!window.confirm("Delete this node?")) return
    try {
      const res = await fetch(
        `${import.meta.env.VITE_WEB_BACKEND_URL}nodes/${node_id}`,
        {
          method: "DELETE",
        }
      )
      if (!res.ok) throw new Error(await res.text())
      enqueueSnackbar("Node deleted", { variant: "success" })
      fetchNodes()
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" })
    }
  }

  const handleSave = async () => {
    try {
      const endpoint = editing
        ? `${import.meta.env.VITE_WEB_BACKEND_URL}nodes/${form.node_id}`
        : `${import.meta.env.VITE_WEB_BACKEND_URL}nodes/create`
      const method = editing ? "PUT" : "POST"
      const body = editing ? { name: form.name, url: form.url } : form

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(await res.text())
      enqueueSnackbar(editing ? "Node updated" : "Node created", {
        variant: "success",
      })
      setDialogOpen(false)
      fetchNodes()
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" })
    }
  }

  const columns = [
    { field: "node_id", headerName: "Node ID", width: 240 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "url", headerName: "URL", width: 260 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenEdit(params.row)} size="small">
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.node_id)}
            size="small"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </>
      ),
    },
  ]

  const valid = form.name && form.url

  return (
    <Box p={1}>
      <Stack direction="row" justifyContent="end" alignItems="center" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          New Node
        </Button>
      </Stack>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={nodes}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.node_id}
        />
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? "Edit Node" : "Create Node"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Node ID"
              value={form.node_id}
              onChange={(e) => setForm({ ...form, node_id: e.target.value })}
              fullWidth
            />
            <TextField
              label="URL"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!valid}>
            {editing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

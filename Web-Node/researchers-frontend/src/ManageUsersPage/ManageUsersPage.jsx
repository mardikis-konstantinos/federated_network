import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TextField,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ListIcon from "@mui/icons-material/List"
import PersonAddIcon from "@mui/icons-material/PersonAdd"

export default function ManageUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [logs, setLogs] = useState([])
  const [logsOpen, setLogsOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  })
  const [editUser, setEditUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    enabled: true,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_WEB_BACKEND_URL}users/by-role/user`
      )
      const data = await res.json()
      setUsers(data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const payload = { ...newUser, requiredActions: [] }
      const res = await fetch(
        `${import.meta.env.VITE_WEB_BACKEND_URL}users/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) throw new Error(`Error: ${res.status}`)
      setCreateOpen(false)
      setNewUser({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
      })
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditClick = (user) => {
    setEditUser({
      id: user.id,
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      enabled: user.enabled,
    })
    setEditOpen(true)
  }

  const handleUpdate = async () => {
    try {
      const { id, ...updateData } = editUser
      const res = await fetch(
        `${import.meta.env.VITE_WEB_BACKEND_URL}users/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      )
      if (!res.ok) throw new Error(`Error: ${res.status}`)
      setEditOpen(false)
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    try {
      await fetch(`${import.meta.env.VITE_WEB_BACKEND_URL}users/${id}`, {
        method: "DELETE",
      })
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleViewLogs = async (id) => {
    setSelectedUser(id)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_WEB_BACKEND_URL}users/${id}/events?max=50`
      )
      const data = await res.json()
      setLogs(data.events)
      setLogsOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "username", headerName: "Username", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    {
      field: "enabled",
      headerName: "Enabled",
      width: 120,
      renderCell: (params) => <Switch checked={params.value} disabled />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleViewLogs(params.row.id)}>
            <ListIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ]

  return (
    <Box p={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button
          variant="contained"
          onClick={() => setCreateOpen(true)}
          startIcon={<PersonAddIcon />}
        >
          Create User
        </Button>
      </Stack>
      <Box mt={2} style={{ height: "calc(100vh - 150px)", width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Box>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Email"
              fullWidth
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
            <TextField
              label="First Name"
              fullWidth
              value={editUser.firstName}
              onChange={(e) =>
                setEditUser({ ...editUser, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name"
              fullWidth
              value={editUser.lastName}
              onChange={(e) =>
                setEditUser({ ...editUser, lastName: e.target.value })
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editUser.enabled}
                  onChange={(e) =>
                    setEditUser({ ...editUser, enabled: e.target.checked })
                  }
                />
              }
              label="Enabled"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={logsOpen}
        onClose={() => setLogsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Events for {selectedUser}</DialogTitle>
        <DialogContent>
          {logs.length ? (
            <Box component="ul" sx={{ pl: 2 }}>
              {logs.map((event) => (
                <div
                  key={event.id}
                  style={{
                    marginBottom: "1rem",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Typography
                    sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}
                  >
                    <div>{event.type}</div>

                    <div>{new Date(event.time).toLocaleString()}</div>
                  </Typography>
                </div>
              ))}
            </Box>
          ) : (
            <Typography variant="body2">No events found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Username"
              fullWidth
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <TextField
              label="First Name"
              fullWidth
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name"
              fullWidth
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

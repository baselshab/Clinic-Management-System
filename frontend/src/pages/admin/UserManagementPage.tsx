import { useState, useEffect } from 'react'
import {
  Container, Typography, Button, Box, IconButton, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, MenuItem, TableRow, TableCell,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Block as BlockIcon, CheckCircle as CheckIcon } from '@mui/icons-material'
import DataTable from '../../components/common/DataTable'
import api from '../../api/client'

interface User {
  id: string
  email: string
  name: string
  role: string
  status: string
  phone?: string
  createdAt: string
  updatedAt: string
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'patient', label: 'Patient' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    status: 'active',
    phone: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const columns = [
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'role', label: 'Role', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    { id: 'createdAt', label: 'Created', minWidth: 150, format: (v: string) => new Date(v).toLocaleDateString() },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' as const },
  ]

  useEffect(() => { fetchUsers() }, [page, limit])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response: any = await api.get('/users', {
        params: { page: page + 1, limit },
      })
      setUsers(response.users || [])
      setTotal(response.total || 0)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status,
        phone: user.phone || '',
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'patient',
        status: 'active',
        phone: '',
      })
    }
    setOpenDialog(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await api.patch(`/users/${editingUser.id}`, formData)
        setSuccess('User updated successfully')
      } else {
        await api.post('/auth/register', formData)
        setSuccess('User created successfully')
      }
      setOpenDialog(false)
      fetchUsers()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      await api.patch(`/users/${user.id}`, { status: newStatus })
      setSuccess(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
      fetchUsers()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`)
        setSuccess('User deleted successfully')
        fetchUsers()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete user')
      }
    }
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, any> = {
      admin: 'error',
      doctor: 'primary',
      nurse: 'success',
      receptionist: 'info',
      patient: 'default',
    }
    return colors[role] || 'default'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      active: 'success',
      inactive: 'default',
      suspended: 'error',
    }
    return colors[status] || 'default'
  }

  const renderRow = (row: User) => (
    <TableRow hover key={row.id}>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell><Chip label={row.role} color={getRoleColor(row.role)} size="small" /></TableCell>
      <TableCell><Chip label={row.status} color={getStatusColor(row.status)} size="small" /></TableCell>
      <TableCell>{row.phone || '-'}</TableCell>
      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
      <TableCell align="center">
        <Tooltip title="Toggle Status">
          <IconButton size="small" onClick={() => handleToggleStatus(row)} color={row.status === 'active' ? 'warning' : 'success'}>
            {row.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => handleOpenDialog(row)}><EditIcon fontSize="small" /></IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => handleDelete(row.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add User</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <DataTable columns={columns} data={users} loading={loading} page={page} limit={limit} total={total} onPageChange={setPage} onLimitChange={setLimit} renderRow={renderRow} emptyMessage="No users found" />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Full Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField label="Email" type="email" fullWidth required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField label="Password" type="password" fullWidth required={!editingUser} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} helperText={editingUser ? 'Leave blank to keep current password' : ''} />
            <TextField label="Role" select fullWidth required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              {ROLE_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Status" select fullWidth required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              {STATUS_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Phone" fullWidth value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingUser ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

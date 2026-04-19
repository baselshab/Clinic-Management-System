import { useState, useEffect } from 'react'
import {
  Container, Typography, Button, Box, IconButton, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, MenuItem, TableRow, TableCell,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import DataTable from '@/components/common/DataTable'
import { staffApi, Staff, CreateStaffDto } from '@/api/services'

const STAFF_ROLES = [
  { value: 'nurse', label: 'Nurse' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'lab_technician', label: 'Lab Technician' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'admin_assistant', label: 'Admin Assistant' },
]

const SHIFT_TYPES = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'night', label: 'Night' },
  { value: 'flexible', label: 'Flexible' },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'nurse',
    position: '',
    department: '',
    phone: '',
    email: '',
    shift: 'morning',
    workingHours: '9:00 AM - 5:00 PM',
    workingDays: [] as string[],
    education: '',
    licenseNumber: '',
    salary: 0,
    currency: 'USD',
    assignedLocation: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    notes: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const columns = [
    { id: 'staffCode', label: 'Code', minWidth: 100 },
    { id: 'fullName', label: 'Name', minWidth: 150 },
    { id: 'role', label: 'Role', minWidth: 120 },
    { id: 'position', label: 'Position', minWidth: 150 },
    { id: 'shift', label: 'Shift', minWidth: 100 },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'actions', label: 'Actions', minWidth: 120, align: 'center' as const },
  ]

  useEffect(() => { fetchStaff() }, [page, limit])

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const response = await staffApi.getAll({ page: page + 1, limit })
      setStaff(response.staff || [])
      setTotal(response.total || 0)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch staff')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff)
      setFormData({
        fullName: staff.fullName,
        role: staff.role,
        position: staff.position || '',
        department: staff.department || '',
        phone: staff.phone || '',
        email: staff.email || '',
        shift: staff.shift,
        workingHours: staff.workingHours || '9:00 AM - 5:00 PM',
        workingDays: staff.workingDays,
        education: staff.education || '',
        licenseNumber: staff.licenseNumber || '',
        salary: staff.salary || 0,
        currency: staff.currency || 'USD',
        assignedLocation: staff.assignedLocation || '',
        emergencyContactName: staff.emergencyContactName || '',
        emergencyContactPhone: staff.emergencyContactPhone || '',
        emergencyContactRelation: staff.emergencyContactRelation || '',
        notes: staff.notes || '',
      })
    } else {
      setEditingStaff(null)
      setFormData({
        fullName: '',
        role: 'nurse',
        position: '',
        department: '',
        phone: '',
        email: '',
        shift: 'morning',
        workingHours: '9:00 AM - 5:00 PM',
        workingDays: [],
        education: '',
        licenseNumber: '',
        salary: 0,
        currency: 'USD',
        assignedLocation: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        notes: '',
      })
    }
    setOpenDialog(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingStaff) {
        await staffApi.update(editingStaff.id, formData)
        setSuccess('Staff updated successfully')
      } else {
        await staffApi.create(formData as CreateStaffDto)
        setSuccess('Staff created successfully')
      }
      setOpenDialog(false)
      fetchStaff()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await staffApi.delete(id)
        setSuccess('Staff deleted successfully')
        fetchStaff()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete')
      }
    }
  }

  const renderRow = (row: Staff) => (
    <TableRow hover key={row.id}>
      <TableCell>{row.staffCode}</TableCell>
      <TableCell>{row.fullName}</TableCell>
      <TableCell>{row.role}</TableCell>
      <TableCell>{row.position || '-'}</TableCell>
      <TableCell><Chip label={row.shift} size="small" /></TableCell>
      <TableCell>{row.phone || '-'}</TableCell>
      <TableCell>{row.email || '-'}</TableCell>
      <TableCell align="center">
        <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenDialog(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(row.id)} color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
      </TableCell>
    </TableRow>
  )

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Staff Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Staff</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <DataTable columns={columns} data={staff} loading={loading} page={page} limit={limit} total={total} onPageChange={setPage} onLimitChange={setLimit} renderRow={renderRow} emptyMessage="No staff found" />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingStaff ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Full Name" fullWidth required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            <TextField label="Role" select fullWidth required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              {STAFF_ROLES.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Position" fullWidth value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
            <TextField label="Department" fullWidth value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
            <TextField label="Phone" fullWidth value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <TextField label="Email" fullWidth value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField label="Shift" select fullWidth value={formData.shift} onChange={(e) => setFormData({ ...formData, shift: e.target.value })}>
              {SHIFT_TYPES.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Salary" type="number" fullWidth value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })} />
          </Box>
          <TextField label="Notes" fullWidth multiline rows={3} sx={{ mt: 2 }} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingStaff ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

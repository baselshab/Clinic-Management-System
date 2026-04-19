import { useState, useEffect } from 'react'
import {
  Container, Typography, Button, Box, IconButton, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, MenuItem, TableRow, TableCell,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import DataTable from '@/components/common/DataTable'
import { appointmentApi, Appointment, CreateAppointmentDto } from '@/api/services'

const APPOINTMENT_TYPES = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'check_up', label: 'Check Up' },
  { value: 'procedure', label: 'Procedure' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    scheduledDate: '',
    duration: 30,
    appointmentType: 'consultation',
    priority: 'normal',
    reason: '',
    symptoms: '',
    notes: '',
    consultationFee: 0,
    isFollowUpNeeded: false,
    sendReminder: true,
    location: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const columns = [
    { id: 'appointmentCode', label: 'Code', minWidth: 100 },
    { id: 'scheduledDate', label: 'Date', minWidth: 150, format: (v: string) => new Date(v).toLocaleString() },
    { id: 'appointmentType', label: 'Type', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'priority', label: 'Priority', minWidth: 100 },
    { id: 'duration', label: 'Duration', minWidth: 100, format: (v: number) => `${v} min` },
    { id: 'actions', label: 'Actions', minWidth: 120, align: 'center' as const },
  ]

  useEffect(() => { fetchAppointments() }, [page, limit])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const response = await appointmentApi.getAll({ page: page + 1, limit })
      setAppointments(response.appointments || [])
      setTotal(response.total || 0)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment)
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        scheduledDate: appointment.scheduledDate.split('T')[0],
        duration: appointment.duration,
        appointmentType: appointment.appointmentType,
        priority: appointment.priority,
        reason: appointment.reason || '',
        symptoms: appointment.symptoms || '',
        notes: appointment.notes || '',
        consultationFee: appointment.consultationFee || 0,
        isFollowUpNeeded: appointment.isFollowUpNeeded,
        sendReminder: appointment.sendReminder,
        location: appointment.location || '',
      })
    } else {
      setEditingAppointment(null)
      setFormData({
        patientId: '',
        doctorId: '',
        scheduledDate: '',
        duration: 30,
        appointmentType: 'consultation',
        priority: 'normal',
        reason: '',
        symptoms: '',
        notes: '',
        consultationFee: 0,
        isFollowUpNeeded: false,
        sendReminder: true,
        location: '',
      })
    }
    setOpenDialog(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingAppointment) {
        await appointmentApi.update(editingAppointment.id, formData)
        setSuccess('Appointment updated successfully')
      } else {
        await appointmentApi.create(formData as CreateAppointmentDto)
        setSuccess('Appointment created successfully')
      }
      setOpenDialog(false)
      fetchAppointments()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await appointmentApi.delete(id)
        setSuccess('Appointment deleted successfully')
        fetchAppointments()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete')
      }
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      pending: 'warning',
      confirmed: 'info',
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'default',
      no_show: 'error',
    }
    return colors[status] || 'default'
  }

  const renderRow = (row: Appointment) => (
    <TableRow hover key={row.id}>
      <TableCell>{row.appointmentCode}</TableCell>
      <TableCell>{new Date(row.scheduledDate).toLocaleString()}</TableCell>
      <TableCell>{row.appointmentType}</TableCell>
      <TableCell><Chip label={row.status} color={getStatusColor(row.status)} size="small" /></TableCell>
      <TableCell>{row.priority}</TableCell>
      <TableCell>{row.duration} min</TableCell>
      <TableCell align="center">
        <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenDialog(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(row.id)} color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
      </TableCell>
    </TableRow>
  )

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Appointments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>New Appointment</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <DataTable columns={columns} data={appointments} loading={loading} page={page} limit={limit} total={total} onPageChange={setPage} onLimitChange={setLimit} renderRow={renderRow} emptyMessage="No appointments found" />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Patient ID" fullWidth required value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} />
            <TextField label="Doctor ID" fullWidth required value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })} />
            <TextField label="Date & Time" type="datetime-local" fullWidth required InputLabelProps={{ shrink: true }} value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} />
            <TextField label="Duration (min)" type="number" fullWidth required value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })} />
            <TextField label="Type" select fullWidth required value={formData.appointmentType} onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}>
              {APPOINTMENT_TYPES.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Priority" select fullWidth required value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
              {PRIORITY_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Consultation Fee" type="number" fullWidth value={formData.consultationFee} onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })} />
            <TextField label="Location" fullWidth value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </Box>
          <TextField label="Reason" fullWidth multiline rows={2} sx={{ mt: 2 }} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
          <TextField label="Symptoms" fullWidth multiline rows={2} sx={{ mt: 2 }} value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingAppointment ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

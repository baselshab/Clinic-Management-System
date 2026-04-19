import { useState, useEffect } from 'react'
import {
  Container, Typography, Button, Box, IconButton, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, TableRow, TableCell,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import DataTable from '@/components/common/DataTable'
import { doctorApi, Doctor, CreateDoctorDto } from '@/api/services'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [formData, setFormData] = useState({
    specialization: '',
    yearsOfExperience: 0,
    consultationFee: 0,
    qualifications: '',
    licenseNumber: '',
    biography: '',
    appointmentDuration: 30,
    maxPatientsPerDay: 15,
    workingHours: '9:00 AM - 5:00 PM',
    workingDays: [] as string[],
    languages: [] as string[],
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const columns = [
    { id: 'doctorCode', label: 'Code', minWidth: 100 },
    { id: 'specialization', label: 'Specialization', minWidth: 150 },
    { id: 'yearsOfExperience', label: 'Experience', minWidth: 100 },
    { id: 'consultationFee', label: 'Fee', minWidth: 100, format: (v: number) => `$${v}` },
    { id: 'qualifications', label: 'Qualifications', minWidth: 150 },
    {
      id: 'isAvailable',
      label: 'Status',
      minWidth: 100,
      format: (v: boolean) => v ? 'Available' : 'Unavailable',
    },
    { id: 'actions', label: 'Actions', minWidth: 120, align: 'center' as const },
  ]

  useEffect(() => { fetchDoctors() }, [page, limit])

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const response = await doctorApi.getAll({ page: page + 1, limit })
      setDoctors(response.doctors || [])
      setTotal(response.total || 0)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor)
      setFormData({
        specialization: doctor.specialization,
        yearsOfExperience: doctor.yearsOfExperience,
        consultationFee: doctor.consultationFee,
        qualifications: doctor.qualifications,
        licenseNumber: doctor.licenseNumber,
        biography: doctor.biography || '',
        appointmentDuration: doctor.appointmentDuration,
        maxPatientsPerDay: doctor.maxPatientsPerDay,
        workingHours: doctor.workingHours || '9:00 AM - 5:00 PM',
        workingDays: doctor.workingDays,
        languages: doctor.languages,
      })
    } else {
      setEditingDoctor(null)
      setFormData({
        specialization: '',
        yearsOfExperience: 0,
        consultationFee: 0,
        qualifications: '',
        licenseNumber: '',
        biography: '',
        appointmentDuration: 30,
        maxPatientsPerDay: 15,
        workingHours: '9:00 AM - 5:00 PM',
        workingDays: [],
        languages: [],
      })
    }
    setOpenDialog(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingDoctor) {
        await doctorApi.update(editingDoctor.id, formData)
        setSuccess('Doctor updated successfully')
      } else {
        await doctorApi.create(formData as CreateDoctorDto)
        setSuccess('Doctor created successfully')
      }
      setOpenDialog(false)
      fetchDoctors()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await doctorApi.delete(id)
        setSuccess('Doctor deleted successfully')
        fetchDoctors()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete')
      }
    }
  }

  const renderRow = (row: Doctor) => (
    <TableRow hover key={row.id}>
      <TableCell>{row.doctorCode}</TableCell>
      <TableCell>{row.specialization}</TableCell>
      <TableCell>{row.yearsOfExperience} years</TableCell>
      <TableCell>${row.consultationFee}</TableCell>
      <TableCell>{row.qualifications}</TableCell>
      <TableCell>
        <Chip label={row.isAvailable ? 'Available' : 'Unavailable'} color={row.isAvailable ? 'success' : 'default'} size="small" />
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenDialog(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(row.id)} color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
      </TableCell>
    </TableRow>
  )

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Doctors Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Doctor</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <DataTable columns={columns} data={doctors} loading={loading} page={page} limit={limit} total={total} onPageChange={setPage} onLimitChange={setLimit} renderRow={renderRow} emptyMessage="No doctors found" />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Specialization" fullWidth required value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
            <TextField label="Years of Experience" type="number" fullWidth required value={formData.yearsOfExperience} onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })} />
            <TextField label="Consultation Fee" type="number" fullWidth required value={formData.consultationFee} onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })} />
            <TextField label="Qualifications" fullWidth value={formData.qualifications} onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })} />
            <TextField label="License Number" fullWidth value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} />
            <TextField label="Appointment Duration (min)" type="number" fullWidth value={formData.appointmentDuration} onChange={(e) => setFormData({ ...formData, appointmentDuration: Number(e.target.value) })} />
          </Box>
          <TextField label="Biography" fullWidth multiline rows={3} sx={{ mt: 2 }} value={formData.biography} onChange={(e) => setFormData({ ...formData, biography: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingDoctor ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

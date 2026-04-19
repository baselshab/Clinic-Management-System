import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  MenuItem,
  TableRow,
  TableCell,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import DataTable from '@/components/common/DataTable'
import { patientApi, Patient, CreatePatientDto, UpdatePatientDto } from '@/api/services'

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

const BLOOD_TYPE_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
]

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState<CreatePatientDto>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    bloodType: 'O+',
    height: undefined,
    weight: undefined,
    allergies: [],
    familyHistory: [],
    currentMedications: [],
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    notes: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const columns = [
    { id: 'patientCode', label: 'Code', minWidth: 100 },
    { id: 'firstName', label: 'First Name', minWidth: 150 },
    { id: 'lastName', label: 'Last Name', minWidth: 150 },
    { id: 'gender', label: 'Gender', minWidth: 100 },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    {
      id: 'bloodType',
      label: 'Blood Type',
      minWidth: 100,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 120,
      align: 'center' as const,
    },
  ]

  useEffect(() => {
    fetchPatients()
  }, [page, limit, search])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const response = await patientApi.getAll({
        page: page + 1,
        limit,
        search: search || undefined,
      })
      setPatients(response.patients || [])
      setTotal(response.total || 0)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient)
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth.split('T')[0],
        gender: patient.gender,
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        city: patient.city || '',
        country: patient.country || '',
        postalCode: patient.postalCode || '',
        bloodType: patient.bloodType || 'O+',
        height: patient.height,
        weight: patient.weight,
        allergies: patient.allergies,
        familyHistory: patient.familyHistory,
        currentMedications: patient.currentMedications,
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
        emergencyContactRelation: patient.emergencyContactRelation || '',
        notes: patient.notes || '',
      })
    } else {
      setEditingPatient(null)
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        phone: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        bloodType: 'O+',
        height: undefined,
        weight: undefined,
        allergies: [],
        familyHistory: [],
        currentMedications: [],
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        notes: '',
      })
    }
    setOpenDialog(true)
    setError(null)
    setSuccess(null)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingPatient(null)
  }

  const handleSubmit = async () => {
    try {
      if (editingPatient) {
        await patientApi.update(editingPatient.id, formData as UpdatePatientDto)
        setSuccess('Patient updated successfully')
      } else {
        // For now, we'll create without userId (backend will need to be updated to allow this)
        await patientApi.create(formData as CreatePatientDto)
        setSuccess('Patient created successfully')
      }
      handleCloseDialog()
      fetchPatients()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientApi.delete(id)
        setSuccess('Patient deleted successfully')
        fetchPatients()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete patient')
      }
    }
  }

  const renderRow = (row: Patient) => (
    <TableRow hover key={row.id}>
      <TableCell>{row.patientCode}</TableCell>
      <TableCell>{row.firstName}</TableCell>
      <TableCell>{row.lastName}</TableCell>
      <TableCell>{row.gender}</TableCell>
      <TableCell>{row.phone || '-'}</TableCell>
      <TableCell>{row.email || '-'}</TableCell>
      <TableCell>
        {row.bloodType ? <Chip label={row.bloodType} size="small" /> : '-'}
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => handleOpenDialog(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => handleDelete(row.id)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Patients Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Patient
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <DataTable
        columns={columns}
        data={patients}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={setLimit}
        renderRow={renderRow}
        emptyMessage="No patients found"
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="First Name"
                fullWidth
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                fullWidth
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
              <TextField
                label="Gender"
                select
                fullWidth
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                {GENDER_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                label="Blood Type"
                select
                fullWidth
                value={formData.bloodType || 'O+'}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
              >
                {BLOOD_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Height (cm)"
                type="number"
                fullWidth
                value={formData.height || ''}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value ? Number(e.target.value) : undefined })
                }
              />
              <TextField
                label="Weight (kg)"
                type="number"
                fullWidth
                value={formData.weight || ''}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </Box>
            <TextField
              label="Address"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mt: 2 }}>
              <TextField
                label="City"
                fullWidth
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <TextField
                label="Country"
                fullWidth
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
              <TextField
                label="Postal Code"
                fullWidth
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </Box>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              sx={{ mt: 2 }}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPatient ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

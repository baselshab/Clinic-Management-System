import { useState, useEffect } from 'react'
import {
  Container, Typography, Button, Box, IconButton, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, MenuItem, TableRow, TableCell,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CheckCircle as FinalizeIcon } from '@mui/icons-material'
import DataTable from '@/components/common/DataTable'
import { medicalRecordApi, MedicalRecord, CreateMedicalRecordDto, Prescription } from '@/api/services'

const VISIT_TYPES = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'lab_test', label: 'Lab Test' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'check_up', label: 'Check Up' },
]

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    visitDate: '',
    visitType: 'consultation',
    chiefComplaint: '',
    physicalExamination: '',
    vitalSigns: '',
    diagnosis: '',
    diagnosisCode: '',
    labTestsOrdered: '',
    labResults: '',
    prescribedMedications: [] as string[],
    prescriptions: [] as Prescription[],
    treatmentPlan: [] as string[],
    referrals: '',
    followUpInstructions: '',
    followUpDate: '',
    doctorNotes: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const columns = [
    { id: 'recordCode', label: 'Code', minWidth: 100 },
    { id: 'visitDate', label: 'Visit Date', minWidth: 150, format: (v: string) => new Date(v).toLocaleDateString() },
    { id: 'visitType', label: 'Type', minWidth: 120 },
    { id: 'diagnosis', label: 'Diagnosis', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' as const },
  ]

  useEffect(() => { fetchRecords() }, [page, limit])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const response = await medicalRecordApi.getAll({ page: page + 1, limit })
      setRecords(response.records || [])
      setTotal(response.total || 0)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch records')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (record?: MedicalRecord) => {
    if (record) {
      setEditingRecord(record)
      setFormData({
        patientId: record.patientId,
        doctorId: record.doctorId,
        visitDate: record.visitDate.split('T')[0],
        visitType: record.visitType,
        chiefComplaint: record.chiefComplaint || '',
        physicalExamination: record.physicalExamination || '',
        vitalSigns: record.vitalSigns || '',
        diagnosis: record.diagnosis || '',
        diagnosisCode: record.diagnosisCode || '',
        labTestsOrdered: record.labTestsOrdered || '',
        labResults: record.labResults || '',
        prescribedMedications: record.prescribedMedications,
        prescriptions: record.prescriptions,
        treatmentPlan: record.treatmentPlan,
        referrals: record.referrals || '',
        followUpInstructions: record.followUpInstructions || '',
        followUpDate: record.followUpDate?.split('T')[0] || '',
        doctorNotes: record.doctorNotes || '',
      })
    } else {
      setEditingRecord(null)
      setFormData({
        patientId: '',
        doctorId: '',
        visitDate: '',
        visitType: 'consultation',
        chiefComplaint: '',
        physicalExamination: '',
        vitalSigns: '',
        diagnosis: '',
        diagnosisCode: '',
        labTestsOrdered: '',
        labResults: '',
        prescribedMedications: [],
        prescriptions: [],
        treatmentPlan: [],
        referrals: '',
        followUpInstructions: '',
        followUpDate: '',
        doctorNotes: '',
      })
    }
    setOpenDialog(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingRecord) {
        await medicalRecordApi.update(editingRecord.id, formData)
        setSuccess('Record updated successfully')
      } else {
        await medicalRecordApi.create(formData as CreateMedicalRecordDto)
        setSuccess('Record created successfully')
      }
      setOpenDialog(false)
      fetchRecords()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await medicalRecordApi.delete(id)
        setSuccess('Record deleted successfully')
        fetchRecords()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete')
      }
    }
  }

  const handleFinalize = async (id: string) => {
    try {
      await medicalRecordApi.finalize(id)
      setSuccess('Record finalized successfully')
      fetchRecords()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to finalize')
    }
  }

  const renderRow = (row: MedicalRecord) => (
    <TableRow hover key={row.id}>
      <TableCell>{row.recordCode}</TableCell>
      <TableCell>{new Date(row.visitDate).toLocaleDateString()}</TableCell>
      <TableCell>{row.visitType}</TableCell>
      <TableCell>{row.diagnosis || '-'}</TableCell>
      <TableCell><Chip label={row.status} color={row.status === 'finalized' ? 'success' : row.status === 'draft' ? 'warning' : 'default'} size="small" /></TableCell>
      <TableCell align="center">
        {row.status === 'draft' && (
          <Tooltip title="Finalize"><IconButton size="small" onClick={() => handleFinalize(row.id)} color="success"><FinalizeIcon fontSize="small" /></IconButton></Tooltip>
        )}
        <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenDialog(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(row.id)} color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
      </TableCell>
    </TableRow>
  )

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Medical Records</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>New Record</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <DataTable columns={columns} data={records} loading={loading} page={page} limit={limit} total={total} onPageChange={setPage} onLimitChange={setLimit} renderRow={renderRow} emptyMessage="No medical records found" />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingRecord ? 'Edit Medical Record' : 'New Medical Record'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Patient ID" fullWidth required value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} />
            <TextField label="Doctor ID" fullWidth required value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })} />
            <TextField label="Visit Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={formData.visitDate} onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })} />
            <TextField label="Visit Type" select fullWidth required value={formData.visitType} onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}>
              {VISIT_TYPES.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          </Box>
          <TextField label="Chief Complaint" fullWidth multiline rows={2} sx={{ mt: 2 }} value={formData.chiefComplaint} onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })} />
          <TextField label="Diagnosis" fullWidth sx={{ mt: 2 }} value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} />
          <TextField label="Diagnosis Code" fullWidth sx={{ mt: 2 }} value={formData.diagnosisCode} onChange={(e) => setFormData({ ...formData, diagnosisCode: e.target.value })} />
          <TextField label="Treatment Plan" fullWidth multiline rows={2} sx={{ mt: 2 }} value={formData.treatmentPlan.join('\n')} onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value.split('\n') })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingRecord ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

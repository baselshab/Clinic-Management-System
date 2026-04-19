import { useState } from 'react'
import {
  Container, Typography, Button, Box, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, MenuItem, Alert,
} from '@mui/material'
import { Download as DownloadIcon, Assessment as AssessmentIcon } from '@mui/icons-material'
import { exportToCSV } from '../../utils/export'
import {
  patientApi, appointmentApi, doctorApi, medicalRecordApi,
  billingApi, staffApi,
} from '../../api/services'

export default function ReportsPage() {
  const [reportType, setReportType] = useState('patients')
  const [reportData, setReportData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const REPORT_TYPES = [
    { value: 'patients', label: 'Patients Report' },
    { value: 'appointments', label: 'Appointments Report' },
    { value: 'doctors', label: 'Doctors Report' },
    { value: 'staff', label: 'Staff Report' },
    { value: 'medical-records', label: 'Medical Records Report' },
    { value: 'invoices', label: 'Invoices Report' },
    { value: 'payments', label: 'Payments Report' },
  ]

  const fetchReportData = async () => {
    setLoading(true)
    setError(null)
    try {
      let data: any[] = []
      
      switch (reportType) {
        case 'patients': {
          const response = await patientApi.getAll({ limit: 1000 })
          data = response.patients || []
          break
        }
        case 'appointments': {
          const response = await appointmentApi.getAll({ limit: 1000 })
          data = response.appointments || []
          break
        }
        case 'doctors': {
          const response = await doctorApi.getAll({ limit: 1000 })
          data = response.doctors || []
          break
        }
        case 'staff': {
          const response = await staffApi.getAll({ limit: 1000 })
          data = response.staff || []
          break
        }
        case 'medical-records': {
          const response = await medicalRecordApi.getAll({ limit: 1000 })
          data = response.records || []
          break
        }
        case 'invoices': {
          const response = await billingApi.getInvoices({ limit: 1000 })
          data = response.invoices || []
          break
        }
        case 'payments': {
          const response = await billingApi.getPayments({ limit: 1000 })
          data = response.payments || []
          break
        }
      }

      setReportData(data)
      setSuccess(`Loaded ${data.length} records`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch report data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const columns = getColumnsForReportType(reportType)
    exportToCSV(reportData, `${reportType}_report`, columns)
  }

  const getColumnsForReportType = (type: string) => {
    switch (type) {
      case 'patients':
        return [
          { label: 'Code', key: 'patientCode' },
          { label: 'First Name', key: 'firstName' },
          { label: 'Last Name', key: 'lastName' },
          { label: 'Gender', key: 'gender' },
          { label: 'Date of Birth', key: 'dateOfBirth' },
          { label: 'Phone', key: 'phone' },
          { label: 'Email', key: 'email' },
          { label: 'Blood Type', key: 'bloodType' },
          { label: 'City', key: 'city' },
          { label: 'Active', key: 'isActive' },
        ]
      case 'appointments':
        return [
          { label: 'Code', key: 'appointmentCode' },
          { label: 'Date', key: 'scheduledDate' },
          { label: 'Type', key: 'appointmentType' },
          { label: 'Status', key: 'status' },
          { label: 'Priority', key: 'priority' },
          { label: 'Duration', key: 'duration' },
          { label: 'Location', key: 'location' },
        ]
      case 'doctors':
        return [
          { label: 'Code', key: 'doctorCode' },
          { label: 'Specialization', key: 'specialization' },
          { label: 'Experience', key: 'yearsOfExperience' },
          { label: 'Fee', key: 'consultationFee' },
          { label: 'Available', key: 'isAvailable' },
          { label: 'Qualifications', key: 'qualifications' },
        ]
      case 'invoices':
        return [
          { label: 'Invoice #', key: 'invoiceNumber' },
          { label: 'Type', key: 'invoiceType' },
          { label: 'Status', key: 'status' },
          { label: 'Total', key: 'totalAmount' },
          { label: 'Paid', key: 'paidAmount' },
          { label: 'Balance', key: 'balanceAmount' },
          { label: 'Issue Date', key: 'issueDate' },
          { label: 'Due Date', key: 'dueDate' },
        ]
      default:
        return undefined
    }
  }

  const renderTable = () => {
    if (reportData.length === 0) return null

    const columns = getColumnsForReportType(reportType)
    if (!columns) return null

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.slice(0, 10).map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {typeof row[col.key] === 'boolean'
                      ? row[col.key]
                        ? 'Yes'
                        : 'No'
                      : typeof row[col.key] === 'number' && col.key.includes('Date')
                      ? new Date(row[col.key]).toLocaleDateString()
                      : row[col.key] ?? '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {reportData.length > 10 && (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            Showing first 10 of {reportData.length} records. Export CSV for full data.
          </Box>
        )}
      </TableContainer>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">Reports</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={reportData.length === 0}
        >
          Export CSV
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Report Type"
              select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              sx={{ minWidth: 250 }}
            >
              {REPORT_TYPES.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={fetchReportData} disabled={loading}>
              {loading ? 'Loading...' : 'Generate Report'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {REPORT_TYPES.find((r) => r.value === reportType)?.label} - {reportData.length} records
            </Typography>
            {renderTable()}
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

import { useState, useEffect } from 'react'
import {
  Container, Typography, Button, Box, IconButton, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, MenuItem, TableRow, TableCell, Grid, Card, CardContent,
} from '@mui/material'
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material'
import DataTable from '@/components/common/DataTable'
import { billingApi, Invoice, CreateInvoiceDto, InvoiceItem } from '@/api/services'

const INVOICE_TYPES = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'lab_test', label: 'Lab Test' },
  { value: 'medication', label: 'Medication' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'annual_checkup', label: 'Annual Checkup' },
  { value: 'other', label: 'Other' },
]

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    invoiceType: 'consultation',
    items: [] as InvoiceItem[],
    subtotal: 0,
    taxPercent: 10,
    taxAmount: 0,
    discountPercent: 0,
    discountAmount: 0,
    totalAmount: 0,
    issueDate: '',
    dueDate: '',
    description: '',
    notes: '',
    isInsuranceClaim: false,
    insuranceProvider: '',
    insurancePolicyNumber: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [stats, setStats] = useState({ totalRevenue: 0, totalPaid: 0, totalPending: 0 })

  const columns = [
    { id: 'invoiceNumber', label: 'Invoice #', minWidth: 120 },
    { id: 'issueDate', label: 'Issue Date', minWidth: 120, format: (v: string) => new Date(v).toLocaleDateString() },
    { id: 'invoiceType', label: 'Type', minWidth: 120 },
    { id: 'totalAmount', label: 'Total', minWidth: 100, format: (v: number) => `$${v.toFixed(2)}` },
    { id: 'paidAmount', label: 'Paid', minWidth: 100, format: (v: number) => `$${v.toFixed(2)}` },
    { id: 'balanceAmount', label: 'Balance', minWidth: 100, format: (v: number) => `$${v.toFixed(2)}` },
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' as const },
  ]

  useEffect(() => { fetchInvoices(); fetchStats() }, [page, limit])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const response = await billingApi.getInvoices({ page: page + 1, limit })
      setInvoices(response.invoices || [])
      setTotal(response.total || 0)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await billingApi.getInvoiceStatistics()
      setStats(response)
    } catch (err) { /* ignore */ }
  }

  const handleOpenDialog = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice)
      setFormData({
        patientId: invoice.patientId,
        doctorId: invoice.doctorId || '',
        invoiceType: invoice.invoiceType,
        items: invoice.items,
        subtotal: invoice.subtotal,
        taxPercent: invoice.taxPercent,
        taxAmount: invoice.taxAmount,
        discountPercent: invoice.discountPercent,
        discountAmount: invoice.discountAmount,
        totalAmount: invoice.totalAmount,
        issueDate: invoice.issueDate.split('T')[0],
        dueDate: invoice.dueDate?.split('T')[0] || '',
        description: invoice.description || '',
        notes: invoice.notes || '',
        isInsuranceClaim: invoice.isInsuranceClaim,
        insuranceProvider: invoice.insuranceProvider || '',
        insurancePolicyNumber: invoice.insurancePolicyNumber || '',
      })
    } else {
      setEditingInvoice(null)
      setFormData({
        patientId: '',
        doctorId: '',
        invoiceType: 'consultation',
        items: [],
        subtotal: 0,
        taxPercent: 10,
        taxAmount: 0,
        discountPercent: 0,
        discountAmount: 0,
        totalAmount: 0,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        description: '',
        notes: '',
        isInsuranceClaim: false,
        insuranceProvider: '',
        insurancePolicyNumber: '',
      })
    }
    setOpenDialog(true)
  }

  const calculateTotals = (items: InvoiceItem[], taxPercent: number, discountPercent: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const discountAmount = (subtotal * discountPercent) / 100
    const taxAmount = ((subtotal - discountAmount) * taxPercent) / 100
    const totalAmount = subtotal - discountAmount + taxAmount
    return { subtotal, discountAmount, taxAmount, totalAmount }
  }

  const addItem = () => {
    const newItem: InvoiceItem = { description: '', quantity: 1, unitPrice: 0, amount: 0 }
    const items = [...formData.items, newItem]
    const totals = calculateTotals(items, formData.taxPercent, formData.discountPercent)
    setFormData({ ...formData, items, ...totals })
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const items = [...formData.items]
    items[index] = { ...items[index], [field]: value }
    items[index].amount = items[index].quantity * items[index].unitPrice
    const totals = calculateTotals(items, formData.taxPercent, formData.discountPercent)
    setFormData({ ...formData, items, ...totals })
  }

  const removeItem = (index: number) => {
    const items = formData.items.filter((_, i) => i !== index)
    const totals = calculateTotals(items, formData.taxPercent, formData.discountPercent)
    setFormData({ ...formData, items, ...totals })
  }

  const handleSubmit = async () => {
    try {
      if (editingInvoice) {
        await billingApi.updateInvoice(editingInvoice.id, formData)
        setSuccess('Invoice updated successfully')
      } else {
        await billingApi.createInvoice(formData as CreateInvoiceDto)
        setSuccess('Invoice created successfully')
      }
      setOpenDialog(false)
      fetchInvoices()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await billingApi.deleteInvoice(id)
        setSuccess('Invoice deleted successfully')
        fetchInvoices()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete')
      }
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      draft: 'default',
      pending: 'warning',
      sent: 'info',
      partially_paid: 'primary',
      paid: 'success',
      overdue: 'error',
      cancelled: 'default',
      refunded: 'default',
    }
    return colors[status] || 'default'
  }

  const renderRow = (row: Invoice) => (
    <TableRow hover key={row.id}>
      <TableCell>{row.invoiceNumber}</TableCell>
      <TableCell>{new Date(row.issueDate).toLocaleDateString()}</TableCell>
      <TableCell>{row.invoiceType}</TableCell>
      <TableCell>${row.totalAmount.toFixed(2)}</TableCell>
      <TableCell>${row.paidAmount.toFixed(2)}</TableCell>
      <TableCell>${row.balanceAmount.toFixed(2)}</TableCell>
      <TableCell><Chip label={row.status} color={getStatusColor(row.status)} size="small" /></TableCell>
      <TableCell align="center">
        <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenDialog(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(row.id)} color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
      </TableCell>
    </TableRow>
  )

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Billing & Payments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>New Invoice</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card><CardContent><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><MoneyIcon sx={{ fontSize: 40, color: 'success.main' }} /><Box><Typography color="textSecondary">Total Revenue</Typography><Typography variant="h5">${stats.totalRevenue?.toFixed(2) || '0.00'}</Typography></Box></Box></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} /><Box><Typography color="textSecondary">Total Paid</Typography><Typography variant="h5">${stats.totalPaid?.toFixed(2) || '0.00'}</Typography></Box></Box></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><MoneyIcon sx={{ fontSize: 40, color: 'warning.main' }} /><Box><Typography color="textSecondary">Pending</Typography><Typography variant="h5">${stats.totalPending?.toFixed(2) || '0.00'}</Typography></Box></Box></CardContent></Card>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <DataTable columns={columns} data={invoices} loading={loading} page={page} limit={limit} total={total} onPageChange={setPage} onLimitChange={setLimit} renderRow={renderRow} emptyMessage="No invoices found" />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'New Invoice'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Patient ID" fullWidth required value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} />
            <TextField label="Doctor ID" fullWidth value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })} />
            <TextField label="Invoice Type" select fullWidth required value={formData.invoiceType} onChange={(e) => setFormData({ ...formData, invoiceType: e.target.value })}>
              {INVOICE_TYPES.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="Issue Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} />
            <TextField label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            <TextField label="Tax %" type="number" fullWidth value={formData.taxPercent} onChange={(e) => {
              const taxPercent = Number(e.target.value)
              const totals = calculateTotals(formData.items, taxPercent, formData.discountPercent)
              setFormData({ ...formData, taxPercent, ...totals })
            }} />
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Items</Typography>
          {formData.items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField label="Description" size="small" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} sx={{ flex: 2 }} />
              <TextField label="Qty" size="small" type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} sx={{ width: 80 }} />
              <TextField label="Price" size="small" type="number" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))} sx={{ width: 100 }} />
              <Tooltip title="Remove"><IconButton size="small" onClick={() => removeItem(index)} color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
            </Box>
          ))}
          <Button onClick={addItem} size="small" sx={{ mt: 1 }}>+ Add Item</Button>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography>Subtotal: ${formData.subtotal.toFixed(2)}</Typography>
            <Typography>Discount ({formData.discountPercent}%): -${formData.discountAmount.toFixed(2)}</Typography>
            <Typography>Tax ({formData.taxPercent}%): +${formData.taxAmount.toFixed(2)}</Typography>
            <Typography variant="h6">Total: ${formData.totalAmount.toFixed(2)}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingInvoice ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

import { useState, useEffect } from 'react'
import {
  Container, Typography, Grid, Card, CardContent, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress,
} from '@mui/material'
import {
  TrendingUp, People, EventNote, LocalHospital, AttachMoney,
  Assessment, CalendarToday, Description,
} from '@mui/icons-material'
import {
  patientApi, appointmentApi, doctorApi, medicalRecordApi,
  billingApi,
} from '../../api/services'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>({
    patientStats: {},
    appointmentStats: {},
    doctorStats: {},
    medicalRecordStats: {},
    invoiceStats: {},
    paymentStats: {},
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const [
        patientStats,
        appointmentStats,
        doctorStats,
        medicalRecordStats,
        invoiceStats,
        paymentStats,
      ] = await Promise.all([
        patientApi.getStatistics().catch(() => ({})),
        appointmentApi.getStatistics().catch(() => ({})),
        doctorApi.getStatistics().catch(() => ({})),
        medicalRecordApi.getStatistics().catch(() => ({})),
        billingApi.getInvoiceStatistics().catch(() => ({})),
        billingApi.getPaymentStatistics().catch(() => ({})),
      ])

      setAnalytics({
        patientStats,
        appointmentStats,
        doctorStats,
        medicalRecordStats,
        invoiceStats,
        paymentStats,
      })
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LinearProgress />
  }

  const kpiCards = [
    {
      title: 'Total Patients',
      value: analytics.patientStats.total || 0,
      subtitle: `${analytics.patientStats.active || 0} active`,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Appointments',
      value: analytics.appointmentStats.total || 0,
      subtitle: `${analytics.appointmentStats.today || 0} today`,
      icon: <EventNote sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
    {
      title: 'Active Doctors',
      value: analytics.doctorStats.active || analytics.doctorStats.total || 0,
      subtitle: `${analytics.doctorStats.total || 0} total`,
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      color: '#4caf50',
    },
    {
      title: 'Total Revenue',
      value: `$${(analytics.invoiceStats.totalRevenue || 0).toFixed(2)}`,
      subtitle: `$${(analytics.invoiceStats.totalPaid || 0).toFixed(2)} collected`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#ff9800',
    },
    {
      title: 'Medical Records',
      value: analytics.medicalRecordStats.total || 0,
      subtitle: `${analytics.medicalRecordStats.recentRecords || 0} this month`,
      icon: <Description sx={{ fontSize: 40 }} />,
      color: '#2196f3',
    },
    {
      title: 'Net Revenue',
      value: `$${((analytics.paymentStats.netRevenue || 0)).toFixed(2)}`,
      subtitle: `${analytics.paymentStats.recentPayments || 0} payments this month`,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#8bc34a',
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4">Analytics & Reporting</Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="textSecondary">{kpi.title}</Typography>
                  <Box sx={{ color: kpi.color }}>{kpi.icon}</Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{kpi.value}</Typography>
                <Typography variant="body2" color="textSecondary">{kpi.subtitle}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Breakdowns */}
      <Grid container spacing={3}>
        {/* Appointment Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalendarToday color="primary" />
                <Typography variant="h6">Appointment Status Breakdown</Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(analytics.appointmentStats.byStatus || []).map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Chip
                            label={item._id}
                            size="small"
                            color={
                              item._id === 'completed' ? 'success' :
                              item._id === 'pending' ? 'warning' :
                              item._id === 'confirmed' ? 'info' :
                              item._id === 'cancelled' ? 'error' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Invoice Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachMoney color="primary" />
                <Typography variant="h6">Invoice Status Breakdown</Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(analytics.invoiceStats.byStatus || []).map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Chip
                            label={item._id}
                            size="small"
                            color={
                              item._id === 'paid' ? 'success' :
                              item._id === 'pending' || item._id === 'sent' ? 'warning' :
                              item._id === 'overdue' ? 'error' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Patient Demographics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <People color="primary" />
                <Typography variant="h6">Patient Gender Distribution</Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Gender</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(analytics.patientStats.byGender || []).map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell><Chip label={item._id} size="small" /></TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Methods */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachMoney color="primary" />
                <Typography variant="h6">Payment Methods</Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Method</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(analytics.paymentStats.byMethod || []).map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell><Chip label={item._id} size="small" /></TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                        <TableCell align="right">${(item.totalAmount || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

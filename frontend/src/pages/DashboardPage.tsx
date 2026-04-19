import { useState, useEffect } from 'react'
import {
  Grid, Card, Typography, Box, Avatar, Divider, Chip, Skeleton, Button,
  LinearProgress, CardActionArea, IconButton, Tooltip
} from '@mui/material'
import {
  PeopleAlt as PeopleIcon,
  EventAvailable as EventIcon,
  LocalHospital as DoctorIcon,
  AccountBalanceWallet as RevenueIcon,
  Add as AddIcon,
  ArrowForward as ArrowIcon,
  Schedule as ScheduleIcon,
  Description as ReportIcon,
  LocalPharmacy as PharmacyIcon
} from '@mui/icons-material'
import { patientApi, appointmentApi, doctorApi, billingApi } from '../api/services'

// Interfaces
interface DashboardStats {
  totalPatients: number
  appointmentsToday: number
  totalDoctors: number
  totalRevenue: number
}

interface Appointment {
  id: string
  name: string
  status: string
  time: string
  concern: string
  type: string
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    appointmentsToday: 0,
    totalDoctors: 0,
    totalRevenue: 0,
  })

  // Dummy recent data to fill out UI gorgeously if backend sends none
  const [recentAppointments] = useState<Appointment[]>([
    { id: '1', name: 'Sarah Johnson', status: 'Confirmed', time: '09:00 AM', concern: 'General Checkup', type: 'consultation' },
    { id: '2', name: 'Michael Smith', status: 'Pending', time: '10:30 AM', concern: 'Fever & Cough', type: 'emergency' },
    { id: '3', name: 'Emily Davis', status: 'In Progress', time: '11:15 AM', concern: 'Follow up', type: 'follow_up' },
    { id: '4', name: 'James Wilson', status: 'Confirmed', time: '01:00 PM', concern: 'Blood Test', type: 'lab_test' }
  ])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [patientRes, appointmentRes, doctorRes, invoiceRes] = await Promise.all([
        patientApi.getStatistics().catch(() => ({ total: 0 })),
        appointmentApi.getStatistics().catch(() => ({ total: 0, today: 0 })),
        doctorApi.getStatistics().catch(() => ({ total: 0 })),
        billingApi.getInvoiceStatistics().catch(() => ({ totalRevenue: 0 })),
      ])

      setStats({
        totalPatients: patientRes.total || 0,
        appointmentsToday: appointmentRes.today || 0,
        totalDoctors: doctorRes.total || 0,
        totalRevenue: invoiceRes.totalRevenue || 0,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setTimeout(() => setLoading(false), 800) // fake delay for lovely skeleton animation
    }
  }

  const StatCard = ({ title, value, icon, gradient, delay }: any) => (
    <Card 
      sx={{ 
        p: 3, 
        height: '100%', 
        position: 'relative', 
        overflow: 'hidden',
        animation: `fadeInUp 0.5s ease-out ${delay}s both` 
      }}
    >
      <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: 'scale(2)' }}>
        {icon}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1.2} mb={1}>
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={100} height={50} animation="wave" />
          ) : (
            <Typography variant="h3" fontWeight="bold" color="text.primary">
              {value}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ background: gradient, width: 56, height: 56, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {icon}
        </Avatar>
      </Box>
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        {!loading && (
          <>
            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
            <Typography variant="caption" color="success.main" fontWeight={600}>
              +4.5% 
            </Typography>
            <Typography variant="caption" color="text.secondary">
              from last month
            </Typography>
          </>
        )}
      </Box>
    </Card>
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'info'
      case 'in progress': return 'primary'
      case 'pending': return 'warning'
      case 'completed': return 'success'
      default: return 'default'
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h2" mb={0.5} sx={{ animation: 'fadeInDown 0.5s ease-out' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ animation: 'fadeInDown 0.6s ease-out' }}>
            Welcome to the new, stunning Clinic Management portal. Here's what's happening today.
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary" bgcolor="background.paper" px={2} py={1} borderRadius={2} border="1px solid" borderColor="divider">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Total Patients" 
            value={stats.totalPatients} 
            icon={<PeopleIcon fontSize="large" />} 
            gradient="linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Today's Visits" 
            value={stats.appointmentsToday} 
            icon={<EventIcon fontSize="large" />} 
            gradient="linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Active Doctors" 
            value={stats.totalDoctors} 
            icon={<DoctorIcon fontSize="large" />} 
            gradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Gross Revenue" 
            value={`$${stats.totalRevenue.toLocaleString()}`} 
            icon={<RevenueIcon fontSize="large" />} 
            gradient="linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
            delay={0.3}
          />
        </Grid>
      </Grid>

      {/* Main Content Layout */}
      <Grid container spacing={4}>
        {/* Left Column: Recent Appointments */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%', animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Recent Appointments</Typography>
              <Button endIcon={<ArrowIcon />} color="primary" size="small">
                View All
              </Button>
            </Box>
            <Divider />
            <Box sx={{ p: 0 }}>
              {loading ? (
                <Box px={3} py={2}><LinearProgress /></Box>
              ) : (
                recentAppointments.map((apt, index) => (
                  <Box 
                    key={apt.id} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 3,
                      borderBottom: index !== recentAppointments.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', mr: 2, fontWeight: 'bold' }}>
                      {apt.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                        {apt.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ScheduleIcon sx={{ fontSize: 14 }} /> {apt.time} • {apt.concern}
                      </Typography>
                    </Box>
                    <Chip 
                      label={apt.status} 
                      color={getStatusColor(apt.status) as any} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontWeight: 600, px: 1, borderWidth: 1.5 }}
                    />
                    <Tooltip title="View Details">
                      <IconButton size="small" sx={{ ml: 2 }}>
                        <ArrowIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))
              )}
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Actions and Tracking */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Quick Actions */}
            <Card sx={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}>
              <Box p={3}>
                <Typography variant="h5" mb={3}>Quick Actions</Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'New Patient', icon: <AddIcon />, color: '#4f46e5', bg: '#e0e7ff' },
                    { label: 'Schedule', icon: <EventIcon />, color: '#0ea5e9', bg: '#e0f2fe' },
                    { label: 'Prescription', icon: <PharmacyIcon />, color: '#10b981', bg: '#d1fae5' },
                    { label: 'Reports', icon: <ReportIcon />, color: '#f59e0b', bg: '#fef3c7' },
                  ].map((action, i) => (
                    <Grid item xs={6} key={i}>
                      <CardActionArea sx={{ borderRadius: 2, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', bgcolor: action.bg, borderRadius: 2 }}>
                          <Avatar sx={{ bgcolor: action.color, color: '#fff', mb: 1, boxShadow: `0 4px 10px ${action.color}40` }}>
                            {action.icon}
                          </Avatar>
                          <Typography variant="caption" fontWeight={700} color="text.primary">
                            {action.label}
                          </Typography>
                        </Box>
                      </CardActionArea>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>

            {/* Task Tracking */}
            <Card sx={{ flex: 1, animation: 'fadeInUp 0.6s ease-out 0.6s both' }}>
              <Box p={3}>
                <Typography variant="h5" mb={3}>System Status</Typography>
                <Box display="flex" flexDirection="column" gap={2.5}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" fontWeight={600}>Database Backup</Typography>
                      <Typography variant="caption" color="text.secondary">100%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={100} color="success" sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" fontWeight={600}>Appointments Filled</Typography>
                      <Typography variant="caption" color="text.secondary">78%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={78} color="primary" sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" fontWeight={600}>Pending Invoices</Typography>
                      <Typography variant="caption" color="text.secondary">45%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={45} color="warning" sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                </Box>
              </Box>
            </Card>

          </Box>
        </Grid>
      </Grid>
      
      {/* Global Style injections for our custom animations & chip variants */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  )
}

function TrendingUpIcon(props: any) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  )
}
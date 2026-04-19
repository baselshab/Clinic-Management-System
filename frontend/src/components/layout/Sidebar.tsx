import { 
  Box, 
  Typography, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Button
} from '@mui/material'
import {
  SpaceDashboard as DashboardIcon,
  EventNote as EventIcon,
  PeopleAlt as PeopleIcon,
  MedicalServices as DoctorIcon,
  AccountBalanceWallet as BillingIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  LocalHospital as ClinicIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { User } from '../../types'

interface SidebarProps {
  user: User | null
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { text: 'Appointments', icon: <EventIcon />, path: '/appointments', roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { text: 'Patients', icon: <PeopleIcon />, path: '/patients', roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { text: 'Doctors', icon: <DoctorIcon />, path: '/doctors', roles: ['admin'] },
  { text: 'Billing', icon: <BillingIcon />, path: '/billing', roles: ['admin', 'receptionist'] },
  { text: 'Reports', icon: <ReportsIcon />, path: '/admin/reports', roles: ['admin'] },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['admin'] },
]

export default function Sidebar({ user }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  // Fallback role for visibility during loading
  const userRole = user?.role?.toLowerCase() || 'admin'
  const filteredMenuItems = menuItems.filter(
    (item) => item.roles.includes(userRole) || userRole === 'admin'
  )

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 4 }}>
      {/* Logo Area */}
      <Box sx={{ px: 3, mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box 
          sx={{ 
            width: 42, 
            height: 42, 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(20, 184, 166, 0.25)'
          }}
        >
          <ClinicIcon sx={{ color: '#fff' }} />
        </Box>
        <Typography 
          variant="h5" 
          fontWeight={800} 
          sx={{ 
            color: 'white', 
            letterSpacing: '-0.02em',
            fontFamily: '"Outfit", sans-serif'
          }}
        >
          ClinicOS
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) || (item.path === '/dashboard' && location.pathname === '/')
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '12px',
                mb: 0.5,
                py: 1.5,
                px: 2,
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
                bgcolor: isActive ? 'rgba(20, 184, 166, 0.15)' : 'transparent',
                '&:hover': {
                  bgcolor: isActive ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: 'white'
                },
                transition: 'all 0.2s'
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40, 
                color: isActive ? '#2dd4bf' : 'inherit' 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.9rem', 
                  fontWeight: isActive ? 700 : 500 
                }} 
              />
              {isActive && (
                <Box sx={{ width: 4, height: 16, bgcolor: '#2dd4bf', borderRadius: 2, ml: 1 }} />
              )}
            </ListItemButton>
          )
        })}
      </List>

      {/* Bottom Card */}
      <Box sx={{ px: 2, mt: 'auto' }}>
        <Box 
          sx={{ 
            p: 3, 
            borderRadius: '16px', 
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center'
          }}
        >
          <Box 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'rgba(20, 184, 166, 0.1)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}
          >
            <ReportsIcon sx={{ color: '#2dd4bf', fontSize: 20 }} />
          </Box>
          <Typography variant="caption" fontWeight={700} color="#fff" display="block" mb={0.5}>
            Need Help?
          </Typography>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" display="block" mb={2}>
            Check our documentation
          </Typography>
          <Button 
            fullWidth 
            variant="contained" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.08)', 
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' }
            }}
          >
            Open Docs
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
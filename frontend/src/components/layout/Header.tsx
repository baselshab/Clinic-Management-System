import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  AppBar, Toolbar, Typography, Box, InputBase, IconButton, 
  Badge, Avatar, Menu, MenuItem, ListItemIcon, Divider
} from '@mui/material'
import {
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  LocalHospital as ClinicIcon
} from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { logout } from '../../store/slices/authSlice'

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    handleMenuClose()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 }, py: 1 }}>
        
        {/* Brand / Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
            }}
          >
            <ClinicIcon sx={{ color: '#fff' }} />
          </Box>
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              background: 'linear-gradient(90deg, #0f172a 0%, #475569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              fontFamily: '"Outfit", sans-serif'
            }}
          >
            ClinicOS
          </Typography>
        </Box>

        {/* Right Section: Search & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
          
          {/* Search Bar */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              px: 2,
              py: 0.75,
              transition: 'all 0.2s ease',
              '&:focus-within': {
                backgroundColor: '#fff',
                borderColor: '#4f46e5',
                boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'
              }
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <InputBase 
              placeholder="Search patients, doctors..." 
              sx={{ width: 220, fontSize: '0.875rem' }} 
            />
          </Box>

          {/* Notifications */}
          <IconButton 
            sx={{ 
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#f1f5f9', transform: 'translateY(-1px)' }
            }}
          >
            <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 600 } }}>
              <NotificationsIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
            </Badge>
          </IconButton>

          <Box sx={{ width: '1px', height: 32, bgcolor: 'divider', display: { xs: 'none', sm: 'block' } }} />

          {/* User Menu */}
          <Box 
            onClick={handleMenuOpen}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '12px',
              transition: 'all 0.2s',
              '&:hover': { backgroundColor: '#f8fafc', transform: 'translateY(-1px)' }
            }}
          >
            <Avatar 
              src={user?.avatar} 
              alt={user?.name}
              sx={{ 
                width: 38, 
                height: 38, 
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: '2px solid #fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {user ? getInitials(user.name) : 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" fontWeight={600} lineHeight={1.2}>
                {user?.name || 'Loading...'}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff'}
              </Typography>
            </Box>
            <ExpandMoreIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 10px 25px rgba(0,0,0,0.1))',
                mt: 1.5,
                borderRadius: '12px',
                minWidth: 200,
                border: '1px solid rgba(226, 232, 240, 0.8)',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.2,
                  borderRadius: '8px',
                  mx: 1,
                  my: 0.5,
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: '#f8fafc' }
                },
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: '#4f46e5' }} />
              </ListItemIcon>
              <Typography variant="body2" fontWeight={500}>My Profile</Typography>
            </MenuItem>
            
            <Divider sx={{ my: 0.5, mx: 2 }} />
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography variant="body2" fontWeight={500} color="error.main">Logout</Typography>
            </MenuItem>
          </Menu>

        </Box>
      </Toolbar>
    </AppBar>
  )
}
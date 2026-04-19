import { ReactNode } from 'react'
import { Box } from '@mui/material'
import { useAppSelector } from '../../hooks'
import Sidebar from './Sidebar'
import Header from './Header'

interface MainLayoutProps {
  children: ReactNode
}

const SIDEBAR_WIDTH = 280

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Sidebar - fixed width container */}
      <Box
        component="nav"
        sx={{
          width: { lg: SIDEBAR_WIDTH },
          flexShrink: { lg: 0 },
        }}
      >
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bgcolor: '#0f172a', // Slate 900
            color: 'white',
            overflowY: 'auto',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            zIndex: (theme) => theme.zIndex.drawer
          }}
        >
          <Sidebar user={user} />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header />
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 4 },
            overflow: 'auto',
            bgcolor: 'inherit'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
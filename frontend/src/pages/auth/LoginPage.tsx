import { useState, FormEvent } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material'
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice'
import { authApi } from '../../api/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(loginStart())

    try {
      const response = await authApi.login({ email, password })
      // Fetch user profile after login
      const userProfile = await authApi.getProfile()
      dispatch(loginSuccess({
        user: userProfile,
        token: response.accessToken,
        refreshToken: response.refreshToken,
      }))
      navigate('/dashboard')
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      dispatch(loginFailure(message))
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '50%', mb: 2 }}>
            <LockOutlinedIcon sx={{ color: 'white', fontSize: 40 }} />
          </Box>
          <Typography component="h1" variant="h5">
            Clinic Management System
          </Typography>
          <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 3 }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1, color: 'white' }}>
          <Typography variant="caption" display="block" gutterBottom fontWeight="bold">
            Default Credentials:
          </Typography>
          <Typography variant="caption" display="block">
            Admin: admin@clinic.com / Admin@123
          </Typography>
          <Typography variant="caption" display="block">
            Doctor: doctor1@clinic.com / Doctor@123
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

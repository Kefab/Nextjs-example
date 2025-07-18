'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Modal,
} from '@mui/material';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Estado para el modal de registro
  const [registerOpen, setRegisterOpen] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [registerMsg, setRegisterMsg] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error('Credenciales inválidas');

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      router.push('/panel');
    } catch (err) {
      setErrorMsg('Loginsss fallido: Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regUsername || !regEmail || !regPassword) {
      setRegisterMsg('Completa todos los campos.');
      return;
    }

    setRegisterMsg('');
    setRegisterLoading(true);

    try {
      const response = await fetch('http://localhost:8000/user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Error al crear usuario');
      }

      setRegisterMsg('¡Usuario creado exitosamente!');
      setTimeout(() => {
        setRegisterOpen(false);
        setRegUsername('');
        setRegEmail('');
        setRegPassword('');
        setRegisterMsg('');
      }, 1500);
    } catch (err: any) {
      setRegisterMsg(err.message || 'Error inesperado');
    } finally {
      setRegisterLoading(false);
    }
  };

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  if (!mounted) return null;

  return (
    <Container className="h-screen flex items-center justify-center">
      <Paper elevation={4} className="p-8 max-w-md w-full shadow-md">
        <Typography variant="h5" className="mb-6 font-semibold text-center">
          Iniciar sesión
        </Typography>

        {errorMsg && (
          <Alert severity="error" className="mb-4">
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              error={!username && !!errorMsg}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              error={!password && !!errorMsg}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Box>
        </form>

        <Box mt={4} textAlign="center">
          <Typography variant="body2">¿No tienes una cuenta?</Typography>
          <Button onClick={() => setRegisterOpen(true)}>Crear cuenta nueva</Button>
        </Box>
      </Paper>

      {/* Modal para registro de usuario */}
      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Crear nuevo usuario</Typography>
          <TextField
            label="Usuario"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Correo"
            type="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            fullWidth
          />
          {registerMsg && (
            <Alert severity={registerMsg.includes('exitosamente') ? 'success' : 'error'}>
              {registerMsg}
            </Alert>
          )}
          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={registerLoading}
          >
            {registerLoading ? 'Registrando...' : 'Registrar'}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

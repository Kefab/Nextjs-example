'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { protectedRoutes } from '../utils/routes';
import {
    Box,
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    CircularProgress,
    Alert,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Panel() {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false); // <- NUEVO

    useEffect(() => {
        setMounted(true); // <- MARCAMOS QUE YA ESTAMOS EN EL CLIENTE
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No hay sesión activa.');
            return;
        }

        fetch('http://localhost:8000/users/me/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Token inválido');
                return res.json();
            })
            .then((data) => setUser(data))
            .catch((err) => setError(err.message));
    }, [mounted]);

    if (!mounted) return null; // <- EVITAMOS renderizar en SSR

    if (error) {
        return (
            <Container className="pt-10">
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="pt-10 text-center">
                <CircularProgress />
                <Typography variant="body1" className="mt-4">
                    Cargando usuario...
                </Typography>
            </Container>
        );
    }

    return (
        <Container className="pt-10">
            <Paper elevation={3} className="p-6">
                <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
                    Bienvenido, {user.username}
                </Typography>

                <Typography variant="subtitle1" className="mb-2 text-gray-600">
                    Rutas disponibles:
                </Typography>

                <List>
                    {protectedRoutes.map((route) => (
                        <ListItem
                            key={route.path}
                            
                            component={Link} // 👈 usamos el componente de Next aquí
                            href={route.path}
                        >
                            <ListItemIcon>
                                <ArrowForwardIosIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={route.label} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
}

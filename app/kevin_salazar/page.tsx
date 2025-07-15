"use client";

import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    Container,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";

interface Champion {
    id: number;
    name: string;
    position: string;
    region: string;
    rol: string;
    age: number
}

export default function ChampionsHome() {
    const [champions, setChampions] = useState<Champion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");
    const [rol, setRol] = useState("");
    const [position, setPosition] = useState("");
    const [region, setRegion] = useState("");
    const [releaseYear, setReleaseYear] = useState(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchChampions = async () => {
        try {
            const response = await fetch("http://localhost:8000/kevin_salazar/champion/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            setChampions(json.champions);
        } catch (err: any) {
            setError(err.message || "Error fetching champions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChampions();
    }, []);

    const handleCreateChampion = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No hay sesión activa");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/kevin_salazar/champion/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    rol,
                    position,
                    region,
                    release_year: releaseYear,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al crear campeón");
            }

            await fetchChampions();
            setName("");
            setRol("");
            setPosition("");
            setRegion("");
            setReleaseYear(0);
            handleClose();
        } catch (err: any) {
            alert(err.message || "Error inesperado");
        }
    };

    const modalStyle = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: 2,
        p: 4,
    };

    return (
        <Container className="py-8">
            <Box className="flex justify-between items-center mb-6">
                <Typography variant="h4" className="text-gray-800 font-semibold">
                    Campeones de Kevin Salazar
                </Typography>
                <Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={handleOpen}>
                    Crear Campeón
                </Button>
            </Box>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" className="mb-4 font-medium">
                        Nuevo Campeón
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid >
                            <TextField label="Nombre" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                        </Grid>
                        <Grid  >
                            <TextField label="Rol" fullWidth value={rol} onChange={(e) => setRol(e.target.value)} />
                        </Grid>
                        <Grid  >
                            <TextField label="Posición" fullWidth value={position} onChange={(e) => setPosition(e.target.value)} />
                        </Grid>
                        <Grid  >
                            <TextField label="Región" fullWidth value={region} onChange={(e) => setRegion(e.target.value)} />
                        </Grid>
                        <Grid  >
                            <TextField
                                label="Año de lanzamiento"
                                fullWidth
                                type="number"
                                value={releaseYear}
                                onChange={(e) => setReleaseYear(Number(e.target.value))}
                            />
                        </Grid>
                        <Grid >
                            <Button variant="contained" fullWidth onClick={handleCreateChampion}>
                                Crear
                            </Button>
                        </Grid>
                        <Grid >
                            <Button variant="outlined" fullWidth onClick={handleClose}>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            {loading ? (
                <Typography className="text-center">Cargando campeones...</Typography>
            ) : error ? (
                <Typography className="text-red-600 text-center">{error}</Typography>
            ) : (
                <Paper elevation={3} className="overflow-x-auto">
                    <Table>
                        <TableHead className="bg-gray-200">
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Posición</TableCell>
                                <TableCell>Región</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell>Edad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {champions.map((champion) => (
                                <TableRow key={champion.id}>
                                    <TableCell>{champion.name}</TableCell>
                                    <TableCell>{champion.position}</TableCell>
                                    <TableCell>{champion.region}</TableCell>
                                    <TableCell>{champion.rol}</TableCell>
                                    <TableCell>{champion.age}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Container>
    );
}

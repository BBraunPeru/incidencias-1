import React, { useEffect, useState } from 'react';
import {
    Autocomplete,
    Box,
    IconButton,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import {
    Save as SaveIcon,
    Phone as PhoneIcon,
    WhatsApp as WhatsAppIcon
} from '@mui/icons-material';

import MiMenu from './MiMenu';

import getColorByEstado from "../colores"

const Incidente = ({ data, currentUser, responsables }) => {
    const [showDetalle, setShowDetalle] = useState(false);
    
    const [estado, setEstado] = useState("");
    const [showResp, setShowResp] = useState(false);
    const [responsable, setResponsable] = useState(null);

    useEffect(() => {
        setEstado(data.estado)
    }, [data.estado])


    let datos = [
        data.servicio,
        data.tipo,
        data.detalle,
        data.reporter,
        data.contacto,
        data.celular,
        data.email,
        data.fecha_reporte,
        data.responsable,
        data.responsable_anterior,
        data.fecha_atencion,
        data.estado];


    const cabeceras = [
        'Servicio',
        'Tipo',
        'Detalle',
        'Reporter',
        'Contacto',
        'Celular',
        'Email',
        'Fecha de Reporte',
        'Responsable',
        'Responsable Anterior',
        'Fecha de Revision',
        'Estado',
    ];


    const updateFieldInc = (key, newState) => {
        console.log(`Actualizando incidencia con id ${data.id} a ${newState}`);
        const apiUrl = `https://ssttapi.mibbraun.pe/incidencias/${data.id}`;

        const dataUdated = { [key]: newState };
        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataUdated),
        })
            .then((response) => {
                if (response.ok) {
                    console.log(`Campo actualizado con éxito para el elemento con ID ${data.id}.`);
                } else {
                    console.error(`Error al actualizar para el elemento con ID ${data.id}.`);
                }
            })
            .catch((error) => {
                console.error('Error de red o solicitud Fetch:', error);
            });
    };

    const AsignResp = () => {
        if (responsable !== null) {
            updateFieldInc('responsable', responsable.usuario);
            updateFieldInc('estado', 'ASIGNADO');
            setEstado('ASIGNADO');
            setShowResp(false);
        }

    };

    return (
        <Paper elevation={3}>
            <Box
                sx={{
                    display: 'flex',
                    gap: '1rem',
                    padding: ".5rem",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `.5rem solid${getColorByEstado(estado)}`
                }}
            >
                <Typography onClick={(e) => setShowDetalle(!showDetalle)} variant='h6' gutterBottom >{data.institucion}</Typography>
                <MiMenu
                    currentUser={currentUser}
                    estado={estado}
                    setEstado={setEstado}
                    handleUpdateState={updateFieldInc}
                    showResp={showResp}
                    setShowResp={setShowResp}
                />

            </Box>
            {showResp && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: '1rem',
                        padding: ".5rem",
                        justifyContent: 'space-between'
                    }}
                >
                    <Autocomplete
                        sx={{ flex: 6 }}
                        options={responsables}
                        getOptionLabel={(option) => option.usuario}
                        value={responsable}
                        onChange={(_, newValue) => {
                            setResponsable(newValue);
                            console.log(newValue);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Selecciona un nombre" variant="outlined" />
                        )}
                    />
                    <IconButton onClick={AsignResp} sx={{ flex: 1 }} disabled={responsable === null}>
                        <SaveIcon sx={{ transform: 'scale(1.3)' }} />
                    </IconButton>
                </Box>
            )}
            {showDetalle && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: ".5rem",
                        padding: ".5rem"
                    }}
                >
                    {cabeceras.map((cabecera, index) => {
                        const dato = datos[index];
                        if (dato !== null && dato !== '') {
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {cabecera}:
                                    </Box>
                                    <Box
                                        sx={{
                                            fontSize: '14px',
                                        }}
                                    >
                                        {dato}
                                    </Box>
                                    {index === 5 && (
                                        <>
                                            <IconButton color="primary" href={`tel:${dato}`}>
                                                <PhoneIcon sx={{ transform: 'scale(1.3)' }} />
                                            </IconButton>
                                            <IconButton color="primary" href={`https://wa.me/051${dato}`}>
                                                <WhatsAppIcon sx={{ transform: 'scale(1.3)' }} />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>
                            );
                        }
                        return null;
                    })}
                </Box>
            )}
        </Paper>
    );
};

export default Incidente;

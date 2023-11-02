import React, { useEffect, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    IconButton,
    Modal,
    Paper,
    Radio,
    RadioGroup,
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

const Incidente = ({ data, currentUser, responsables}) => {
    const [showDetalle, setShowDetalle] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [estado, setEstado] = useState("");
    const [showResp, setShowResp] = useState(false);
    const [responsable, setResponsable] = useState(null);

    useEffect(() => {
        setEstado(data.estado)
    }, [data.estado])

    const tecnicos = responsables.map((item) => ({
        id: item.id,
        label: `${item.nombres} ${item.apellidos}`,
    }));

    let datos = [
        data.servicio,
        data.tipo,
        data.fall,
        data.reporter,
        data.contacto,
        data.celular,
        data.email,
        data.fecha_reporte,
        data.responsable,
        data.fecha_revision,
        data.estado_final,
        data.estado];


    const cabeceras = [
        'Servicio',
        'Tipo',
        'Descripción',
        'Reporter',
        'Contacto',
        'Celular',
        'Email',
        'Fecha_Reporte',
        'Responsable',
        'Fecha_Revision',
        'Estado_Final',
        'Estado',
    ];

    const handleShowDetail = () => {
        setShowDetalle(!showDetalle);
    };

    const handleChangeState = (e) => {
        if (currentUser.roll !== 'admin') {
            if (estado !== 'ATENDIDO') {
                setSelectedValue(e.target.value);
                setModalOpen(true);
            } else {
                alert('Una incidencia atendida ya no puede cambiar el estado, comuníquese con el administrador en caso de error');
            }
        } else {
            setSelectedValue(e.target.value);
            setModalOpen(true);
        }
    };

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

    const handleConfirm = () => {
        setModalOpen(false);
        updateFieldInc("estado", selectedValue)
        setEstado(selectedValue)
    };
    const handleSelectResponsable = (e) => {
        console.log(data.id);
        setShowResp(!showResp);
    };

    const AsignResp = () => {
        console.log(`Asignando a técnico con id ${responsable.id}`);
        updateFieldInc('responsable_id', responsable.id);
        updateFieldInc('estado', 'ASIGNADO');
        setEstado('ASIGNADO');
        setShowResp(false);
    };

    const handleUpdateState = (e) => {
        console.log('ACTUALIZANDO ESTADO');
        updateFieldInc('estado', 'ASIGNADO');
        setEstado('ASIGNADO');
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
                    handleUpdateState ={updateFieldInc}
                    showResp = {showResp}
                    setShowResp = {setShowResp}
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
                        options={tecnicos}
                        getOptionLabel={(option) => option.label}
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
                    <IconButton onClick={AsignResp} sx={{ flex: 1 }}>
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
                    {currentUser.roll !== 'representante' && (
                        <FormControl component="fieldset">
                            <Box
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Estado:
                            </Box>
                            <RadioGroup
                                row
                                aria-label="position"
                                name="position"
                                value={estado}
                                onChange={handleChangeState}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {currentUser.roll !== 'admin' ? (
                                    <>
                                        <FormControlLabel
                                            value="ATENDIDO"
                                            control={<Radio color="primary" />}
                                            label="Atendido"
                                            labelPlacement="top"
                                        />
                                        <FormControlLabel
                                            value="PENDIENTE"
                                            control={<Radio color="primary" />}
                                            label="Pendiente"
                                            labelPlacement="top"
                                        />
                                    </>
                                ) : (
                                    <FormControlLabel
                                        value="CANCELADO"
                                        control={<Radio color="primary" />}
                                        label="Cancelado"
                                        labelPlacement="top"
                                    />
                                )}
                            </RadioGroup>
                        </FormControl>
                    )}
                </Box>
            )}
            <Modal open={isModalOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <p>¿Desea cambiar el estado?</p>
                    <Button color="primary" onClick={() => setModalOpen(false)}>
                        Cancelar
                    </Button>
                    <Button color="error" onClick={handleConfirm}>
                        Confirmar
                    </Button>
                </Box>
            </Modal>
        </Paper>
    );
};

export default Incidente;

import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';


const MiMenu = (
    { currentUser,
        estado,
        setEstado,
        handleUpdateState,
        setShowSelectResp,
        responsable,
        setResponsable,
        responsableAnterior,
        setResponsableAnterior,
        grado,
        setGrado
    }) => {
    const [isModalOpen, setModalOpen] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const [newState, setNewState] = React.useState("")

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleShowResponsable = () => {
        setShowSelectResp(true)
        handleClose()
    }

    const handleAssignMyself = () => {
        if (responsableAnterior !== currentUser.usuario) {
            handleUpdateState("estado","ASIGNADO")
            setEstado("ASIGNADO")
            handleUpdateState("responsable", currentUser.usuario)
            setResponsable(currentUser.usuario)
            
        } else {
            alert("No esta permitido asignarse una orden abandonada")
        }
        handleClose()
    }

    const updateGrado = () => {
        setGrado("URGENTE")
        handleUpdateState("grado", "URGENTE")
        handleClose()
    }

    const handleChangeState = (state) => {
        setNewState(state)
        setModalOpen(true)
    }

    const UpdateState = () => {
        if (newState === "ABANDONADO") {
            console.log("Abandonando orden ...")
            handleUpdateState("estado", newState)
            handleUpdateState("responsable_anterior", currentUser.usuario)
            handleUpdateState("responsable", null)
            setResponsable(null)
            setResponsableAnterior(currentUser.usuario)
            setEstado(newState)

        } else {
            handleUpdateState("estado", newState)
            setEstado(newState)
        }

        setModalOpen(false)
        handleClose()

    }

    let adminOptions = null;
    let tecnicoOptions = null;
    let representanteOptions = null;

    if (currentUser.roll === 'admin') {
        adminOptions = [
            <MenuItem key="option1" onClick={(e) => handleShowResponsable()} disabled={estado !== "POR ASIGNAR"}>Asignar</MenuItem>,
            <MenuItem key="option2" onClick={(e) => handleShowResponsable()} disabled={(estado === "POR ASIGNAR")}>Reasignar</MenuItem>,
            <MenuItem key="option3" onClick={(e) => handleChangeState("ASIGNADO")} disabled={estado !== "ATENDIDO"}>Reiniciar</MenuItem>,
            <MenuItem key="option4" onClick={(e) => handleChangeState("CANCELADO")} disabled={estado === "ATENDIDO" || estado === "CANCELADO"}>Cancelar</MenuItem>
        ];
    }
    else if (currentUser.roll === 'tecnico') {
        tecnicoOptions = [
            <MenuItem key="option1" onClick={(e) => handleChangeState("ATENDIDO")} disabled={estado === "ATENDIDO" || estado === "ABANDONADO"}>Marcar como atendida</MenuItem>,
            <MenuItem key="option2" onClick={(e) => handleChangeState("PENDIENTE")} disabled={estado === "ATENDIDO" || estado === "PENDIENTE" || estado === "ABANDONADO"}>Marcar como pendiente</MenuItem>,
            <MenuItem key="option3" onClick={(e) => handleAssignMyself()} disabled={!(estado === "ABANDONADO")}>Asignarme esta orden</MenuItem>,
            <MenuItem key="option4" onClick={(e) => handleChangeState("ABANDONADO")} disabled={estado === "ATENDIDO" || estado === "ABANDONADO"}>Abandonar esta orden</MenuItem>
        ];
    }
    else {
        representanteOptions = [
            <MenuItem key="option1" onClick={(e) => updateGrado()} disabled={grado === "URGENTE"}>Marcar como urgente</MenuItem>
        ];

    }

    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {adminOptions}
                {tecnicoOptions}
                {representanteOptions}
            </Menu>

            <Modal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box sx={{ padding: '1rem', borderRadius: '8px'}}>
                    <Typography variant='p'> ¿Desea cambiar el estado?</Typography>
                    <Button color="primary" onClick={() => {setModalOpen(false);handleClose()}}>
                        Cancelar
                    </Button>
                    <Button color="error" onClick={(e) => UpdateState()}>
                        Confirmar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default MiMenu;
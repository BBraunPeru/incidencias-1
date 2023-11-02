import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';


const MiMenu = ({ currentUser,estado,setEstado,handleUpdateState,showResp,setShowResp }) => {
    const [isModalOpen, setModalOpen] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const UpdateState = (newState) => {
        console.log(`ACTUALIZANDO ESTADO A ${newState}`)
        handleUpdateState("estado",newState)
        setEstado(newState)
    }

    const handleShowResponsable = () => {
        setShowResp(true)
        handleClose()
    }

    const handleAbandon = () => {
        console.log("Abandonando orden ...")
        UpdateState("ABANDONADO")
        handleUpdateState("responsable_anterior",currentUser.usuario)
        handleUpdateState("responsable",null)
    }
    const handleAssignMyself = () => {
        console.log("Asignandome orden")
        UpdateState("ASIGNADO")
        handleUpdateState("responsable",currentUser.usuario)
    }

    let adminOptions = null;
    let tecnicoOptions = null;
    let representanteOptions = null;

    if (currentUser.roll === 'admin') {
        adminOptions = [
            <MenuItem key="option1" onClick={(e) => handleShowResponsable()} disabled ={estado!=="POR ASIGNAR"}>Asignar</MenuItem>,
            <MenuItem key="option2" onClick={(e) => handleShowResponsable()} disabled ={(estado=== "POR ASIGNAR")}>Reasignar</MenuItem>,
            <MenuItem key="option3" onClick={(e) => UpdateState("ASIGNADO")} disabled = {estado!=="ATENDIDO"}>Reiniciar</MenuItem>,
            <MenuItem key="option4" onClick={(e) => UpdateState("CANCELADO")} disabled={estado==="ATENDIDO" || estado === "CANCELADO"}>Cancelar</MenuItem>
        ];
    }
    else if (currentUser.roll === 'tecnico') {
        tecnicoOptions = [
            <MenuItem key="option1" onClick={(e) => setModalOpen(false)} disabled = {estado==="ATENDIDO" || estado === "ABANDONADO"}>Marcar como atendida</MenuItem>,
            <MenuItem key="option2" onClick={(e) => UpdateState("PENDIENTE")} disabled = {estado==="ATENDIDO" || estado === "PENDIENTE" || estado === "ABANDONADO"}>Marcar como pendiente</MenuItem>,
            <MenuItem key="option3" onClick={(e) => handleAssignMyself()} disabled = {!(estado==="ABANDONADO")}>Asignarme esta orden</MenuItem>,
            <MenuItem key="option4" onClick={(e) => handleAbandon()} disabled = {estado==="ATENDIDO" || estado === "ABANDONADO"}>Abandonar esta orden</MenuItem>
        ];
    }
    else{
        representanteOptions = [
            <MenuItem key="option1" onClick={handleClose}>Marcar como urgente</MenuItem>
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
                <Box sx={{ padding: '1rem', borderRadius: '8px' }}>
                    <Typography variant='p'> ¿Desea cambiar el estado?</Typography>
                    <Button color="primary" onClick={() => setModalOpen(false)}>
                        Cancelar
                    </Button>
                    <Button color="error" onClick={(e) => UpdateState("ATENDIDO")}>
                        Confirmar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default MiMenu;
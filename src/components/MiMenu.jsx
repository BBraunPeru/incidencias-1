import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';


const MiMenu = ({ currentUser,estado,setEstado,handleUpdateState,showResp,setShowResp }) => {
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
        console.log("mostrando tecnicos")
        setShowResp(true)
    }

    let adminOptions = null;
    let tecnicoOptions = null;
    let representanteOptions = null;

    if (currentUser.roll === 'admin') {
        adminOptions = [
            <MenuItem key="option1" onClick={(e) => handleShowResponsable()} disabled ={estado!=="POR ASIGNAR"}>Asignar</MenuItem>,
            <MenuItem key="option2" onClick={(e) => handleClose} disabled ={!(estado=== "ASIGNADO")}>Reasignar</MenuItem>,
            <MenuItem key="option3" onClick={(e) => UpdateState("ASIGNADO")} disabled = {estado!=="ATENDIDO"}>Reiniciar</MenuItem>,
            <MenuItem key="option4" onClick={(e) => UpdateState("CANCELADO")} disabled={estado==="ATENDIDO"}>Cancelar</MenuItem>
        ];
    }
    else if (currentUser.roll === 'tecnico') {
        tecnicoOptions = [
            <MenuItem key="option1" onClick={(e) => UpdateState("ATENDIDO")} disabled = {estado==="ATENDIDO"}>Marcar como atendida</MenuItem>,
            <MenuItem key="option2" onClick={(e) => UpdateState("PENDIENTE")} disabled = {estado==="ATENDIDO" || estado === "PENDIENTE"}>Marcar como pendiente</MenuItem>,
            <MenuItem key="option3" onClick={(e) => UpdateState("ABANDONADO")} disabled = {estado==="ATENDIDO"}>Abandonar orden</MenuItem>
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
        </div>
    );
}

export default MiMenu;
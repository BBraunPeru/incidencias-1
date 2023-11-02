import { AppBar, Box, Button, Drawer, IconButton, Input, TextField, Toolbar, Typography } from "@mui/material";
import NavBarListDrawer from "./NavListDrawer"
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonIcon from '@mui/icons-material/Person';
import GradingIcon from '@mui/icons-material/Grading';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import getColorByEstado from "../../colores";

const NavBar = ({ currentUser, searchTerm, setSearchTerm, stateFilter, setStateFilter }) => {
    const [openMenu, setOpenMenu] = useState(false);

    const navStateFilterList = [
        {
            title: "Todo",
            icon: <GradingIcon />,
            estado:""
        },
        {
            title: "Por Asignar",
            icon: <PersonIcon />,
            estado:"POR ASIGNAR"
        },
        
        {
            title: "Asignado",
            icon: <AssignmentIndIcon />,
            estado:"ASIGNADO"
        },

        {
            title: "Atendido",
            icon: <CheckCircleOutlineIcon />,
            estado:"ATENDIDO"
        },
        {
            title: "Pendiente",
            icon: <ModeStandbyIcon />,
            estado:"PENDIENTE"
        },
        {
            title: "Cancelado",
            icon: <HighlightOffIcon />,
            estado:"CANCELADO"
        }
    ]
    return (
        <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
            <AppBar>
                <Toolbar>
                    <IconButton
                        size="large"
                        onClick={(e) => setOpenMenu(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Incidencias</Typography>

                    <Input
                        id="searchTerm"
                        disableUnderline={true}
                        variant=""
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                        placeholder="Buscar por institucion ..."
                        sx={{
                            border: "1px solid #ccc", // Establece el borde con el color y grosor que desees
                            borderRadius: "4px",
                            padding: ".2rem .5rem",
                            marginInline: ".5rem"
                        }}
                    ></Input>

                    {
                        navStateFilterList.map((item, index) => (
                            <Button
                                onClick={() => setStateFilter(item.estado)}
                                key={index}
                                sx={
                                    stateFilter === item.estado
                                        ? {
                                            borderBottom: `.2rem solid ${getColorByEstado(stateFilter)}`,
                                        }
                                        : {}
                                }
                            >
                                {item.title}
                            </Button>
                        ))
                    }

                </Toolbar>
            </AppBar>

            <Drawer
                open={openMenu}
                anchor="left"
                onClose={() => setOpenMenu(false)}>
                <NavBarListDrawer
                    currentUser={currentUser}
                    stateFilter={stateFilter}
                    setStateFilter={setStateFilter}
                    navStateFilterList={navStateFilterList} />
            </Drawer>
        </Box>
    )
}

export default NavBar;
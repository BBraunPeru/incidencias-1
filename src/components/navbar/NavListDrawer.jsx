import { Box, Card, CardContent, Divider, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import getColorByEstado from "../../colores";



const NavBarListDrawer = ({ currentUser, stateFilter, setStateFilter, navStateFilterList }) => {
    function capitalizeFirstLetterOnly(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    return (
        <Box>
            <Card sx={{ maxWidth: 360, bgcolor: "background.paper" }}>
                <CardContent>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <AccountCircleIcon
                            sx={{ fontSize: 80, color: "#3f51b5" }}
                        />
                        <Typography variant="p" align="center">
                            {currentUser.apellidos}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Divider />
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Filtrar Incidencias
                    </ListSubheader>
                }
            >

                {
                    navStateFilterList.map((item, index) => (
                        <ListItemButton
                            key={index}
                            onClick={() => setStateFilter(item.estado)}
                            sx={
                                stateFilter === item.estado
                                    ? {
                                        borderLeft: `.2rem solid ${getColorByEstado(stateFilter)}`
                                    }
                                    : {}
                            }
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    ))
                }
            </List>

            <Divider />
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Usuario
                    </ListSubheader>
                }>
                <ListItemButton>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar Session" />
                </ListItemButton>
            </List>

        </Box>
    )
}

export default NavBarListDrawer;
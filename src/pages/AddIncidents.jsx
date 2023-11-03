import { useState } from "react"
import Exito from "../components/exito"
import Error from "../components/error"
import { Link } from "react-router-dom"
import { Container, Paper, Typography } from "@mui/material"
import Formulario from "../components/formulario"


export function getCurrentDate(separator = '/') {

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
}


const AddIncidents = () => {
    const [showForm, setShowForm] = useState(true)
    const [exito, setExito] = useState(true)


    return (
        <Container maxWidth="xs" style={{ display: "flex", alignItems: "center",minHeight:"100vh" }}>
            <Paper elevation={3} sx={{ display:"flex",flexDirection:"column",gap:"1rem",padding:"1rem" }}>
                {showForm ? (
                    <>
                        <Link to={"/home"} style={{ textDecoration: "none" }}><Typography color="primary" variant="h5">Registro de Incidencias</Typography></Link>
                        <Formulario
                            setShowForm={setShowForm}
                            setExito={setExito} />
                    </>
                ) : (
                    exito ? (
                        <Exito
                            setShowForm={setShowForm} />
                    ) : (
                        <Error
                            setShowForm={setShowForm}
                        />
                    )
                )}
            </Paper>
        </Container>
    )
}


export default AddIncidents;
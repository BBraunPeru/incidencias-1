import { useEffect, useState } from "react"
import { Autocomplete, Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material"

const Formulario = ({ setShowForm, setExito }) => {

    //VARIABLES PARA EL FORMULARIO
    const [institucion, setInstitucion] = useState(null)
    const [servicio, setServicio] = useState(null)
    const [tipo, setTipo] = useState(null)
    const [detalle, setDetalle] = useState("")
    const [reporter, setReporter] = useState(null)
    const [contacto, setContacto] = useState("")
    const [celular, setCelular] = useState("")
    const [email, setEmail] = useState("")


    //VARIABLES EL FETCH
    const [instituciones, setInstituciones] = useState(null)
    const [servicios, setServicios] = useState(null)
    const [tipos, setTipos] = useState(null)
    const [reporters, setReporters] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false); // Nuevo estado para controlar la carga de datos
    const [loading, setLoading] = useState(false);
    const objetCurrentUser = localStorage.getItem("currentUser");
    const currentUser = JSON.parse(objetCurrentUser);
    const showReporter = currentUser.roll === "admin"

    useEffect(() => {

        // Realiza las solicitudes de datos una vez cuando el componente se monta
        Promise.all([
            fetch("https://ssttapi.mibbraun.pe/usuarios").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/instituciones").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/servicios").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/tipos").then((response) => response.json())
        ])
            .then(([usersData, institucionesData, serviciosData, tiposData]) => {
                setInstituciones(institucionesData);
                setServicios(serviciosData);
                setTipos(tiposData);
                setDataLoaded(true);
                setReporters(usersData.filter((user) => user.roll === 'representante'))// Marca los datos como cargados
            })
            .catch((error) => console.error(error));
    }, []);


    const handleAddData = (e) => {
        e.preventDefault();
        setLoading(true);
        const dataToSend = {
            "institucion": institucion.institucion,
            "servicio": servicio.servicio,
            "tipo": tipo.tipo,
            "detalle": detalle,
            "reporter": currentUser.roll !== "admin" ? currentUser.usuario : reporter.usuario,
            "contacto": contacto,
            "celular": celular,
            "email": email
        }

        console.log(dataToSend)

        fetch("https://ssttapi.mibbraun.pe/incidencias", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        })
            .then(resp => {
                if (resp.status === 200) {
                    setExito(true);
                } else {
                    setExito(false);
                }
                return resp.json()
            })
            .then(data => {
                setLoading(false);
                setShowForm(false);
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setExito(false); // Puedes configurar esto según tus necesidades
            });

        console.log("agreganddo data")
    };



    return (
        <Box sx={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
            {
                (dataLoaded) ? (
                    <form onSubmit={handleAddData} style={{display:"flex", flexDirection:"column","gap":"1rem"}}>
                        <Autocomplete
                            id="institucion"
                            options={instituciones}
                            getOptionLabel={(option) => option.institucion}
                            value={institucion}
                            onChange={(_, value) => setInstitucion(value)}
                            renderInput={(params) => <TextField {...params} label="Institucion" fullWidth  required/>}
                        />
                        <Autocomplete
                            id="servicios"
                            options={servicios}
                            getOptionLabel={(option) => option.servicio}
                            value={servicio}
                            onChange={(_, value) => setServicio(value)}
                            renderInput={(params) => <TextField {...params} label="Servicio" fullWidth required/>}
                        />
                        <Autocomplete
                            id="tipos"
                            options={tipos}
                            getOptionLabel={(option) => option.tipo}
                            value={tipo}
                            onChange={(_, value) => setTipo(value)}
                            renderInput={(params) => <TextField {...params} label="Tipo" fullWidth required />}
                        />

                        <TextField type="text" value={detalle} label="Detalle" onChange={(e) => setDetalle(e.target.value)} required />

                        {
                            showReporter && (
                                <Autocomplete
                                    options={reporters}
                                    getOptionLabel={(option) => option.usuario}
                                    value={reporter}
                                    onChange={(_, newValue) => setReporter(newValue)}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Representante"
                                            fullWidth
                                            required
                                        />
                                    )}
                                />
                            )


                        }
                        <TextField type="text" value={contacto} label="Contacto" onChange={(e) => setContacto(e.target.value)} required />

                        <TextField type="tel" value={celular} label="N° Celular de Contacto" onChange={(e) => setCelular(e.target.value)} pattern="[9][0-9]{8}" required />
                        <TextField type="email" value={email} label="E-mail de Contacto" onChange={(e) => setEmail(e.target.value)} />

                        <Button type="submit" variant="contained" sx={{ marginTop: "1rem", padding: "1rem", fontWeight: "bold" }} >Agregar</Button>

                        {loading && (
                            <Modal
                                open={loading}
                                onClose={() => setLoading(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <CircularProgress />
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        Agregando incidencia
                                    </Typography>
                                </Box>
                            </Modal>
                        )}
                    </form>
                ) : <p>Cargando Datos ....</p>
            }
        </Box>
    )
}

export default Formulario;
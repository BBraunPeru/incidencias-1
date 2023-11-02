import { Container} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Incidente from "../components/Incidente";
import NavBar from "../components/navbar/Navbar";

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");//busqueda de incidencias por instituciones
    const [stateFilter,setStateFilter] = useState("") //parametro para filtrar incidencias por estado
    const [fetchComplete, setFetchComplete] = useState(false)
    const [datos, setDatos] = useState([])
    const objetCurrentUser = localStorage.getItem("currentUser");
    const currentUser = JSON.parse(objetCurrentUser);
    const [responsables, setResponsables] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (fetchComplete) {
            return; // No hacer nada si ya se ha completado la carga
        }

        const fetchData = async () => {
            try {
                if (currentUser.roll !== "admin") {
                    const response = await fetch(`https://ssttapi.mibbraun.pe/incidencias/${currentUser.roll}/${currentUser.id}`);
                    if (!response.ok) {
                        throw new Error('Hubo un problema con la petición Fetch: ' + response.status);
                    }
                    const data = await response.json();
                    setFetchComplete(true)
                    setDatos(data)
                } else {
                    const [responsablesResponse, incidenciasResponse] = await Promise.all([
                        fetch("https://ssttapi.mibbraun.pe/usuarios"),
                        fetch("https://ssttapi.mibbraun.pe/incidencias"),
                    ]);

                    if (!responsablesResponse.ok) {
                        throw new Error('Hubo un problema con la petición Fetch de usuarios: ' + responsablesResponse.status);
                    }
                    const responsablesData = await responsablesResponse.json();
                    setResponsables(responsablesData);

                    if (!incidenciasResponse.ok) {
                        throw new Error('Hubo un problema con la petición Fetch de incidencias: ' + incidenciasResponse.status);
                    }
                    const incidenciasData = await incidenciasResponse.json();
                    setFetchComplete(true)
                    setDatos(incidenciasData);
                }
            } catch (error) {
                console.error(error);
                alert(error); // Muestra un pop-up de error
            }
        };

        fetchData();
    }, [currentUser, fetchComplete]);

    if (!datos) {
        return (
            <Container>
                <p>Cargando datos...</p>
            </Container>
        );
    }

    
    const datosInvertidos = [...datos].reverse().filter((fila) => {
        const institucion = fila.institucion.toLowerCase();
        const estado = fila.estado.toLowerCase();
        return institucion.includes(searchTerm.toLowerCase()) && estado.includes(stateFilter.toLowerCase());
      });
    ;
    let datosFiltrados = [...datosInvertidos];
    // console.log(datosFiltrados)

    if (currentUser.roll === "representante") {
        datosFiltrados = datosInvertidos.filter((fila) => currentUser.id === fila.reporter_id);
    } else if (currentUser.roll === "tecnico") {
        datosFiltrados = datosInvertidos.filter((fila) => currentUser.id === fila.responsable_id);
    }

    const handleSwitch = (e) => {
        navigate("/add");
    };


    return (
        <>
            <NavBar
            currentUser={currentUser}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            stateFilter ={stateFilter}
            setStateFilter = {setStateFilter}
            />

            <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", gap: "1rem", mt: "80px" }}>
                {
                    datosFiltrados.map((fila, i) => {
                        return (
                            <Incidente key={i}
                                data={fila}
                                currentUser={currentUser}
                                responsables={[...responsables].filter(resp => resp.roll === "tecnico")}
                            />
                        )
                    })
                }
            </Container>
        </>
    )
}

export default Home;
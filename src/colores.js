const getColorByEstado = (estado) => {
    switch (estado) {
        case "ATENDIDO":
            return "#00ba37"; // Color para ATENDIDO
        case "PENDIENTE":
            return "#ec6711"; // Color para PENDIENTE
        case "CANCELADO":
            return "#FF333C"; // Color para CANCELADO
        case "POR ASIGNAR":
            return "#ffffff"; // Color para POR ASIGNAR

        case "ASIGNADO":
            return "#ffff00"; // Color para POR ASIGNAR
        default:
            return "#800080"; // Color predeterminado
    }
};

export default getColorByEstado;
function openRegisterPage() {
    document.getElementById('registerSection').style.display = 'block';
    window.scrollTo({ top: document.getElementById('registerSection').offsetTop, behavior: 'smooth' });
}





async function actualizarProgresoSorteos() {
    try {
        const response = await fetch("http://localhost:5000/api/sorteos/progreso");
        const progreso = await response.json(); // [{ sorteo_id, total, vendidos }]

        progreso.forEach((item) => {
            const porcentaje = (item.vendidos / item.total) * 100;
            const barra = document.getElementById(`progreso-barra-${item.sorteo_id}`);
            const texto = document.getElementById(`contador-boletos-${item.sorteo_id}`);

            if (barra) barra.style.width = `${porcentaje}%`;
            if (texto) texto.innerText = `${item.vendidos} de ${item.total} vendidos`;
        });
    } catch (error) {
        console.error("Error al cargar progreso de sorteos:", error);
    }
}





// 🧠 Ejecutar una vez que cargue la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarProgresoSorteos();
 
});
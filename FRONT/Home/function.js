async function cargarSorteosHome() {
    try {
        const response = await fetch("https://api.meteleconfe.com/api/sorteos");
        const sorteos = await response.json();
        console.log('Sorteos recibidos:', sorteos);
        const contenedor = document.getElementById('sorteos-lista-home'); // Usa el id de tu contenedor

        contenedor.innerHTML = ''; // Limpia el contenido anterior

        sorteos.forEach((sorteo) => {
            const div = document.createElement('div');
            div.className = 'card-sorteo m-2';
            div.innerHTML = `
                <div class="badge-time">CIERRA: ${sorteo.fecha_sorteo}</div>
                <img src="${sorteo.imagen_url || '../img/default.png'}" class="img-fluid mb-3 img-sorteo-fija" alt="${sorteo.nombre}">
                <div class="progress-container">
                  <div class="progress-bar" id="progreso-barra-${sorteo.id}" style="width:0%"></div>
                </div>
                <p id="contador-boletos-${sorteo.id}" style="font-size: 0.9rem; opacity: 0.7;"></p>
                <h5>${sorteo.nombre}</h5>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <div class="price">S/2.50</div>
                  <button class="btn-round">+</button>
                </div>
            `;
            contenedor.appendChild(div);
        });

        // Actualiza el progreso de los sorteos después de cargarlos
        actualizarProgresoSorteos();
    } catch (error) {
        console.error("Error al cargar sorteos:", error);
    }
}

// Ejecutar ambas funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarSorteosHome();
});
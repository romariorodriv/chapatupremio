function validarSesion() {
  if (!localStorage.getItem('username')) {
    localStorage.clear();
    window.location.replace("../Home/index.html");
  }
}

document.addEventListener('DOMContentLoaded', () => {

  validarSesion();

  // Mostrar el nombre de usuario en el dashboard
  const username = localStorage.getItem('username') || 'Invitado';
  document.getElementById('usernameDisplay').innerText = username;

  // Evento cerrar sesión
  const cerrarSesionBtn = document.getElementById("cerrarSesion");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../Home/index.html";
    });
  }
  // Llama a cargar sorteos
  cargarSorteos();
});



async function cargarSorteos() {
  try {
    const response = await fetch('https://api.meteleconfe.com/api/sorteos');
    const sorteos = await response.json();
    console.log('Sorteos recibidos:', sorteos);
    const contenedor = document.getElementById('lista-sorteos');
    contenedor.innerHTML = '';
    sorteos.forEach(sorteo => {
      const div = document.createElement('div');
      div.className = 'col-md-4 col-sm-6 mb-4';
      div.innerHTML = `
        <div class="card shadow">
          <img src="${sorteo.imagen_url || '../img/default.png'}" class="card-img-top img-sorteo-fija" alt="${sorteo.nombre}">
          <div class="card-body text-center">
            <h5 class="card-title">${sorteo.nombre}</h5>
            <p class="card-text">${sorteo.descripcion || ''}</p>
            <a href="../tickets/tickets.html?sorteo=${sorteo.id}" class="btn btn-dashboard-properties">Comprar boleto</a>
          </div>
        </div>
      `;
      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar sorteos:', error);
  }
}

// Detecta si el usuario vuelve con el botón "atrás" o "adelante" y limpia la sesión
window.addEventListener('pageshow', function(event) {
  if (event.persisted || !localStorage.getItem('username')) {
    localStorage.clear();
    window.location.replace("../Home/index.html");
  }
});
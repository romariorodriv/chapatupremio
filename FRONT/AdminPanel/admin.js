document.addEventListener('DOMContentLoaded', () => {
  // Mostrar formulario de login
  document.getElementById('admin-content').innerHTML = `
    <form id="loginForm">
      <input type="email" id="email" placeholder="Email" required class="form-control mb-2">
      <input type="password" id="password" placeholder="Contraseña" required class="form-control mb-2">
      <button type="submit" class="btn btn-primary">Iniciar sesión</button>
    </form>
    <div id="loginError" class="text-danger mt-2"></div>
  `;

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await fetch('https://api.meteleconfe.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.role === 'admin') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      mostrarPanelAdmin();
    } else {
      document.getElementById('loginError').textContent = 'Acceso denegado o credenciales incorrectas.';
    }
  });
});

function mostrarPanelAdmin() {
  // Aquí irá el código para mostrar la tabla de usuarios y tickets
  document.getElementById('admin-content').innerHTML = `
    <h2>Usuarios registrados</h2>
    <table class="table" id="tablaUsuarios">
      <thead>
        <tr><th>ID</th><th>Usuario</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>
      </thead>
      <tbody></tbody>
    </table>
    <h2>Tickets vendidos</h2>
    <table class="table" id="tablaTickets">
      <thead>
        <tr><th>ID</th><th>Usuario</th><th>Sorteo</th><th>Fecha</th></tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  cargarUsuarios();
  cargarTickets();
}

async function cargarUsuarios() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/admin/users', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const users = await res.json();
  const tbody = document.querySelector('#tablaUsuarios tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    tbody.innerHTML += `<tr>
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>
        <!-- Aquí puedes agregar botones para editar/eliminar -->
      </td>
    </tr>`;
  });
}

async function cargarTickets() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/admin/tickets', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const tickets = await res.json();
  const tbody = document.querySelector('#tablaTickets tbody');
  tbody.innerHTML = '';
  tickets.forEach(t => {
    tbody.innerHTML += `<tr>
      <td>${t.id}</td>
      <td>${t.usuario_id}</td>
      <td>${t.sorteo_id}</td>
      <td>${t.fecha}</td>
    </tr>`;
  });
}
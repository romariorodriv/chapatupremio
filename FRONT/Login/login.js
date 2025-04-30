document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://api.meteleconfe.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('username', data.username);
            localStorage.setItem('usuario_id', data.usuario_id); // 🔥 Guarda el ID del usuario logueado
            window.location.href = data.redirectUrl;
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error de conexión: Verifica que el backend esté corriendo.');
    }
});

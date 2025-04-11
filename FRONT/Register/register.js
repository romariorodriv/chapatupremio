document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('username', data.username);
            window.location.href = data.redirectUrl;
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error de conexión: Verifica que el backend esté corriendo.');
    }
});
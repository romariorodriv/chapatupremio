document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const termsCheckbox = document.getElementById("terminos");
    const registerButton = document.getElementById("registerButton");

    // Función para validar el nombre de usuario (solo letras)
    const validateUsername = (username) => /^[a-zA-Z\s]+$/.test(username);

    // Función para validar el password
    const validatePassword = (password) =>
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,24}$/.test(password);

    // Función para habilitar o deshabilitar el botón
    const toggleButtonState = () => {
        const isFormValid =
            validateUsername(usernameInput.value) &&
            emailInput.value.trim() !== "" &&
            validatePassword(passwordInput.value) &&
            termsCheckbox.checked;

        registerButton.disabled = !isFormValid;
    };

    // Agrega eventos de escucha a los campos del formulario
    usernameInput.addEventListener("input", toggleButtonState);
    emailInput.addEventListener("input", toggleButtonState);
    passwordInput.addEventListener("input", toggleButtonState);
    termsCheckbox.addEventListener("change", toggleButtonState);

    // Validación final al enviar el formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita el envío del formulario si hay errores

        if (!validateUsername(usernameInput.value)) {
            alert("El nombre de usuario solo debe contener letras.");
            return;
        }

        if (!validatePassword(passwordInput.value)) {
            alert(
                "La contraseña debe tener entre 8 y 24 caracteres, incluir al menos un número y un carácter especial."
            );
            return;
        }

        // Si todo es válido, envía los datos al backend
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('https://api.meteleconfe.com/api/auth/register', {
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
});
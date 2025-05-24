document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const termsCheckbox = document.getElementById("terminos");
  const registerButton = document.getElementById("registerButton");
  const showLoginButton = document.getElementById('showLoginButton');
  const showRegisterButton = document.getElementById('showRegisterButton');

  //contraseña 


  const lengthValidation = document.getElementById("lengthValidation");
  const uppercaseValidation = document.getElementById("uppercaseValidation");
  const numberValidation = document.getElementById("numberValidation");
  const specialCharValidation = document.getElementById("specialCharValidation");



  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;

    // Validar longitud
    if (password.length >= 8) {
      lengthValidation.textContent = "✔️ Debe tener al menos 8 caracteres";
      lengthValidation.classList.remove("text-danger");
      lengthValidation.classList.add("text-success");
    } else {
      lengthValidation.textContent = "❌ Debe tener al menos 8 caracteres";
      lengthValidation.classList.remove("text-success");
      lengthValidation.classList.add("text-danger");
    }

    // Validar mayúsculas
    if (/[A-Z]/.test(password)) {
      uppercaseValidation.textContent = "✔️ Debe incluir una letra mayúscula";
      uppercaseValidation.classList.remove("text-danger");
      uppercaseValidation.classList.add("text-success");
    } else {
      uppercaseValidation.textContent = "❌ Debe incluir una letra mayúscula";
      uppercaseValidation.classList.remove("text-success");
      uppercaseValidation.classList.add("text-danger");
    }

    // Validar números
    if (/\d/.test(password)) {
      numberValidation.textContent = "✔️ Debe incluir un número";
      numberValidation.classList.remove("text-danger");
      numberValidation.classList.add("text-success");
    } else {
      numberValidation.textContent = "❌ Debe incluir un número";
      numberValidation.classList.remove("text-success");
      numberValidation.classList.add("text-danger");
    }

    // Validar carácter especial
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      specialCharValidation.textContent = "✔️ Debe incluir un carácter especial (por ejemplo: @, #, $, etc.)";
      specialCharValidation.classList.remove("text-danger");
      specialCharValidation.classList.add("text-success");
    } else {
      specialCharValidation.textContent = "❌ Debe incluir un carácter especial (por ejemplo: @, #, $, etc.)";
      specialCharValidation.classList.remove("text-success");
      specialCharValidation.classList.add("text-danger");
    }

    // Habilitar el botón de registro si todas las validaciones son correctas
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      registerButton.disabled = false;
    } else {
      registerButton.disabled = true;
    }
  });
  // Mostrar el formulario de inicio de sesión y ocultar el de registro
  showLoginButton.addEventListener('click', () => {
    form.style.display = 'none';
    loginForm.style.display = 'block';
  });

  // Mostrar el formulario de registro y ocultar el de inicio de sesión
  showRegisterButton.addEventListener('click', () => {
    loginForm.style.display = 'none';
    form.style.display = 'block';
  });

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
        //localStorage.setItem('username', data.username);
        //window.location.href = data.redirectUrl;
        // Oculta el formulario de registro y muestra el de login

        form.style.display = 'none';
        loginForm.style.display = 'block';
        // Muestra mensaje de éxito
        document.getElementById('responseMessage').textContent = "¡Registro exitoso! Ahora inicia sesión.";
        document.getElementById('responseMessage').style.color = "green";
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error de conexión: Verifica que el backend esté corriendo.');
    }
  });

  // Manejar el formulario de inicio de sesión
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("https://api.meteleconfe.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("usuario_id", data.usuario_id); // Guarda el ID del usuario logueado
        if (data.token) {
          localStorage.setItem("token", data.token); // Guarda el token JWT
        }
        window.location.href = data.redirectUrl;
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Error de conexión: Verifica que el backend esté corriendo.");
    }
  });
});



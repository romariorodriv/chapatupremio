let boletosSeleccionados = [];
const precioPorBoleto = 60;

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sorteoId = urlParams.get("sorteo");

    if (!sorteoId) {
        alert("Sorteo no encontrado");
        window.location.href = "dashboard.html";
        return;
    }
   
    try {
        const response = await fetch(`https://api.meteleconfe.com/api/sorteos/boletos/${sorteoId}`);

        if (!response.ok) {
            throw new Error("Error al obtener los boletos");
        }

        const textResponse = await response.text();
        const boletos = JSON.parse(textResponse);

        const ticketsContainer = document.getElementById("tickets-container");
        ticketsContainer.innerHTML = "";

        boletos.forEach((boleto) => {
            const ticket = document.createElement("div");
            ticket.classList.add("ticket");
            ticket.innerText = boleto.numero;

            if (boleto.vendido) {
                ticket.classList.add("sold");
            } else {
                ticket.addEventListener("click", () => toggleSeleccion(boleto.numero, ticket));
            }

            ticketsContainer.appendChild(ticket);
        });

        // Mostrar nombre del usuario en el resumen
        const nombre = localStorage.getItem("username") || "Usuario";
        document.getElementById("nombre-usuario").innerText = nombre;

    } catch (error) {
        console.error("Error al cargar boletos:", error);
        alert("No se pudieron cargar los boletos.");
    }
});

function toggleSeleccion(numero, elemento) {
    if (boletosSeleccionados.includes(numero)) {
        boletosSeleccionados = boletosSeleccionados.filter(n => n !== numero);
        elemento.style.background = "";
        elemento.classList.remove("seleccionado");
    } else {
        boletosSeleccionados.push(numero);
        elemento.style.background = "green";
        elemento.classList.add("seleccionado");
    }

    actualizarResumenCompra();
}

function actualizarResumenCompra() {
    const lista = document.getElementById("lista-boletos");
    const total = document.getElementById("total-pagar");

    lista.innerHTML = "";

    boletosSeleccionados.forEach(numero => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${numero}</td><td>S/${precioPorBoleto}.00</td>`;
        lista.appendChild(fila);
    });

    total.innerText = boletosSeleccionados.length * precioPorBoleto;
}

document.getElementById("confirmarCompra").addEventListener("click", async () => {
    const usuarioId = localStorage.getItem("usuario_id");

    const urlParams = new URLSearchParams(window.location.search);
    const sorteoId = urlParams.get("sorteo");
    console.log(localStorage.getItem("usuario_id"));

    if (!usuarioId || boletosSeleccionados.length === 0) {
        alert("Debes seleccionar al menos un boleto y estar logueado.");
        return;
    }
    // Construir el mensaje para WhatsApp
    const numeroWhatsApp = "51945253117"; // Reemplaza con el número de WhatsApp del equipo
    const boletos = boletosSeleccionados.join(", ");
    const total = boletosSeleccionados.length * precioPorBoleto;

    const mensaje = `Hola equipo de metele confe, quiero comprar los siguientes tickets: ${boletos}. El total es S/${total}.00. Adjunto mi depósito a su cuenta para separar los tickets.`;

    // Codificar el mensaje para la URL
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    // Redirigir a WhatsApp
    window.location.href = urlWhatsApp;

    try {
        const response = await fetch("https://api.meteleconfe.com/api/compras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuarioId,
                sorteo_id: sorteoId,
                boletos: boletosSeleccionados
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("¡Compra exitosa!");
            location.reload();
        } else {
            alert("Error en la compra: " + result.message);
        }
    } catch (error) {
        console.error("Error en la compra:", error);
        alert("No se pudo realizar la compra.");
    }
});

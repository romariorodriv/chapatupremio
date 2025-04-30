document.addEventListener("DOMContentLoaded", async () => {
    const usuarioId = localStorage.getItem("usuario_id");
    const username = localStorage.getItem("username");
    document.getElementById("usernameTitle").innerText = username;
  
    try {
      const res = await fetch(`https://api.meteleconfe.com/api/historial/${usuarioId}`);
      const data = await res.json();
  
      const tbody = document.querySelector("tbody");
      tbody.innerHTML = "";
  
      data.forEach(item => {
        const tr = document.createElement("tr");
  
        const tdBoleto = document.createElement("td");
        tdBoleto.innerText = item.numero_boleto || "—";
  
        const tdPrecio = document.createElement("td");
        tdPrecio.innerText = "S/60.00";
  
        const tdFecha = document.createElement("td");
        tdFecha.innerText = new Date(item.fecha).toLocaleDateString('es-PE');
  
        const tdSorteo = document.createElement("td");
        tdSorteo.innerText = item.sorteo || "—";
  
        tr.appendChild(tdBoleto);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdFecha);
        tr.appendChild(tdSorteo);
  
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error en historial:", error);
      document.getElementById("historialContainer").innerHTML = "<p>Error al cargar el historial.</p>";
    }
  });
  
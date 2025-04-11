document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username') || 'Invitado';
  document.getElementById('usernameDisplay').innerText = username;


  if (username) {
      document.getElementById("usernameDisplay").innerText = username;
  }

  document.getElementById("cerrarSesion").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../index.html";
  });
});

const ctx1 = document.getElementById('segmentChart').getContext('2d');
new Chart(ctx1, {
  type: 'line',
  data: {
    labels: ['Oct', 'Nov', 'Dic'],
    datasets: [
      { label: 'Segment A', borderColor: 'blue', data: [1000, 1100, 1250] },
      { label: 'Segment B', borderColor: 'yellow', data: [950, 1050, 1230] }
    ]
  }
});

const ctx2 = document.getElementById('ticketChart').getContext('2d');
new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: ['Ene', 'Feb', 'Mar'],
    datasets: [
      { label: 'Tickets Vendidos', backgroundColor: 'lightblue', data: [1500, 1200, 1800] },
      { label: 'Objetivo', backgroundColor: 'red', data: [1400, 1300, 1600] }
    ]
  }
});

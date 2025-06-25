let selectedCity = "";

async function autocompleteCity(query) {
  const list = document.getElementById("suggestions");
  if (!query) {
    list.innerHTML = "";
    return;
  }
  const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=46ef8d93c0414f0f85f123007252506&q=${query}`);
  const data = await res.json();
  list.innerHTML = "";
  data.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city.name + ", " + city.region;
    li.onclick = () => {
      document.getElementById("city").value = city.name;
      selectedCity = city.name;
      list.innerHTML = "";
    };
    list.appendChild(li);
  });
}

let chart;

async function fetchWeather() {
  const spinner = document.getElementById("spinner");
  const chartEl = document.getElementById("chart");
  chartEl.classList.add("hidden");
  spinner.classList.remove("hidden");

  const city = selectedCity || document.getElementById("city").value || "Delhi";
  const res = await fetch(`/api/weather?city=${city}`);
  const data = await res.json();

  spinner.classList.add("hidden");

  let html = `<h2>${data.city}</h2>`;
  const labels = [];
  const temps = [];

  data.weather.forEach(day => {
    labels.push(day.date);
    temps.push(day.temp_c);
    html += `
      <div class="card">
        <strong>${day.date}</strong><br>
        🌡️ Temp: ${day.temp_c}°C <br>
        ☁️ Condition: ${day.condition}
      </div>`;
  });

  document.getElementById("output").innerHTML = html;

  if (chart) chart.destroy();
  chart = new Chart(chartEl, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Avg Temp (°C)',
        data: temps,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: '7-Day Temperature Trend' }
      }
    }
  });

  chartEl.classList.remove("hidden");
}
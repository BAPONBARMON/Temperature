export default async function handler(req, res) {
  const city = req.query.city || "Delhi";
  const apiKey = "46ef8d93c0414f0f85f123007252506";
  const url = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=`;
  let today = new Date();
  let dates = [];
  for (let i = 0; i < 7; i++) {
    let d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  const results = [];
  for (let date of dates) {
    const response = await fetch(`${url}${date}`);
    const data = await response.json();
    results.push({
      date,
      temp_c: data.forecast.forecastday[0].day.avgtemp_c,
      condition: data.forecast.forecastday[0].day.condition.text
    });
  }
  res.status(200).json({
    city,
    weather: results.reverse()
  });
}
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("search");
});
var city;
app.get("/weather", function (req, res) {
  //for time
  let options = { weekday: "long", day: "numeric", month: "long" };
  let today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let ampm;
  if (hours > 00 && hours < 12) ampm = "AM";
  else ampm = "PM";

  let time = hours + ":" + minutes;
  let day = today.toLocaleDateString("en-US", options);

  //weather
  let url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=c445d38478ec4fe7b5bbd91dd0c916b8&units=metric";

  https.get(url, function (response) {
    response.on("data", function (data) {
      var weatherData = JSON.parse(data);

      let temp = weatherData.main.temp;
      let humidity = weatherData.main.humidity;
      let pressure = weatherData.main.pressure;
      let icon = weatherData.weather[0].icon;
      let speed = weatherData.wind.speed;
      let min = weatherData.main.temp_min;
      let max = weatherData.main.temp_max;
      let imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.render("index", {
        clock: time,
        ampm: ampm,
        Date: day,
        temprature: temp,
        pressure: pressure,
        humidity: humidity,
        link: imgURL,
        windspeed: speed,
        min: min,
        max: max,
        city: city,
      });
    });
  });
});

app.post("/", function (req, res) {
  city = req.body.city;
  res.redirect("/weather");
});

app.listen(port, function () {
  console.log("App is listening to port 3000");
});

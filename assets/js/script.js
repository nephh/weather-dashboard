var apiKey = "83959524a30156f2092bdf19a81286b7";
var citySearchForm = document.getElementById("city-search-form");
var cityInput = document.getElementById("city-input");
var currentWeatherSection = document.getElementById("current-weather");
var forecastSection = document.getElementById("forecast");
var searchHistorySection = document.getElementById("search-history");

citySearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  var city = cityInput.value.trim();
  if (city) {
    getLocationCoords(city);
    saveSearch(city);
    displaySearchHistory();
  }
});

function saveSearch(city) {
  var searchHistory = localStorage.getItem("searchHistory");

  searchHistory = searchHistory ? JSON.parse(searchHistory) : [];

  var existingSearchIndex = searchHistory.findIndex(
    (search) => search.toLowerCase() === city.toLowerCase()
  );

  if (existingSearchIndex >= 0) {
    searchHistory.splice(existingSearchIndex, 1);
  }

  searchHistory.push(city);

  if (searchHistory.length > 6) {
    searchHistory.shift();
  }

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function displaySearchHistory() {
  var searchHistory = localStorage.getItem("searchHistory");

  searchHistory = searchHistory ? JSON.parse(searchHistory) : [];

  searchHistorySection.innerHTML = "";

  searchHistory.forEach((search) => {
    var listItem = document.createElement("li");
    listItem.classList.add("menu-list");
    listItem.style.cursor = "pointer";
    listItem.innerHTML = "<a>" + search + "</a>";
    listItem.addEventListener("click", () => {
      getLocationCoords(search);
    });
    searchHistorySection.appendChild(listItem);
  });
}

function getLocationCoords(city) {
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=5&appid=" +
    apiKey;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.length > 0) {
          getWeatherData(data[0].lat, data[0].lon);
        } else {
          alert("Error: No valid city found.");
        }
      });
    }
  });
}

function getWeatherData(lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

        var filteredData = data.list.filter(function (entry) {
          return entry.dt_txt.includes("00:00:00");
        });

        var limitedData = filteredData.slice(0, 5);

        currentWeatherSection.innerHTML = "";
        forecastSection.innerHTML = "";
        displayCurrentWeather(data);
        displayForecast(limitedData);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

// Function to display current weather conditions
function displayCurrentWeather(data) {
  var currentTemperature = data.list[0].main.temp;
  var windSpeed = data.list[0].wind.speed;
  var humidityPercent = data.list[0].main.humidity;
  var cityName = data.city.name;
  var iconId = data.list[0].weather[0].icon;

  var temp = document.createElement("p");
  var wind = document.createElement("p");
  var humidity = document.createElement("p");
  var icon = document.createElement("img");
  var iconUrl = "http://openweathermap.org/img/w/" + iconId + ".png";

  temp.textContent = "Current Temperature: " + currentTemperature + "°F";
  wind.textContent = "Wind Speed: " + windSpeed + "MPH";
  humidity.textContent = "Humidity: " + humidityPercent + "%";
  icon.setAttribute("src", iconUrl);

  currentWeatherSection.appendChild(icon);
  document.querySelector("#city").textContent = cityName + " Current Weather:";
  currentWeatherSection.appendChild(temp);
  currentWeatherSection.appendChild(wind);
  currentWeatherSection.appendChild(humidity);
}

function displayForecast(data) {
  data.forEach(function (forecastData) {
    var forecastDate = new Date(forecastData.dt_txt);
    var forecastTemperature = forecastData.main.temp;
    var forecastWind = forecastData.wind.speed;
    var forecastHumidity = forecastData.main.humidity;
    var forecastIcon = forecastData.weather[0].icon;

    var eachDay = document.createElement("div");
    eachDay.classList.add("box", "m-2", "has-background-link", "has-text-white", "column");

    var dateHeading = document.createElement("h3");
    dateHeading.classList.add("title", "has-text-white");
    dateHeading.textContent = forecastDate.toLocaleDateString();

    var tempForecast = document.createElement("p");
    var windForecast = document.createElement("p");
    var humidityForecast = document.createElement("p");
    var iconForecast = document.createElement("img");
    var iconUrlForecast =
      "http://openweathermap.org/img/w/" + forecastIcon + ".png";

    tempForecast.textContent =
      "Current Temperature: " + forecastTemperature + "°F";
    windForecast.textContent = "Wind Speed: " + forecastWind + "MPH";
    humidityForecast.textContent = "Humidity: " + forecastHumidity + "%";
    iconForecast.setAttribute("src", iconUrlForecast);

    eachDay.appendChild(dateHeading);
    eachDay.appendChild(iconForecast);
    eachDay.appendChild(tempForecast);
    eachDay.appendChild(windForecast);
    eachDay.appendChild(humidityForecast);

    forecastSection.appendChild(eachDay);
  })
}

// Initial setup or any other necessary logic
displaySearchHistory();

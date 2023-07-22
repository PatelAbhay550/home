       const Loc = document.getElementById("name");
        const Temp = document.getElementsByClassName("temp");
        const geocodeApiUrl = "https://api.openweathermap.org/geo/1.0/reverse";
        const searchval = document.getElementById("winp");
        const Rain = document.getElementsByClassName("rain");
        const myloc = document.getElementById("myloc");
        
        const Hum = document.getElementsByClassName("humidity");
        const apikey = "863242cfb2b1d357e6093d9a4df19a4b";
        const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
        function checkWeather(city) {
            fetch(apiurl + city + `&appid=${apikey}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    updateWeatherDisplay(data);
                })
                .catch((error) => {
                    console.error(error);
                });
                fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apikey}`)
            .then((response) => response.json())
            .then((data) => {
                updateForecastDisplay(data);
            })
            .catch((error) => {
                console.error(error);
            });
        }
        function updateForecastDisplay(data) {
        const forecastList = data.list;

        for (let i = 0; i < 3; i++) {
            const forecast = forecastList[i * 8]; // Get the forecast for the next 24 hours

            const date = new Date(forecast.dt * 1000);
            const dateElement = document.querySelectorAll(".c" + (i + 1) + " li")[0];
            dateElement.textContent = date.toLocaleDateString();

            const tempElement = document.querySelectorAll(".c" + (i + 1) + " li")[1];
            tempElement.textContent = "Temp: " + Math.round(forecast.main.temp) + "°C";

            const rainElement = document.querySelectorAll(".c" + (i + 1) + " li")[2];
            const rainPercentage = (forecast.rain && forecast.rain["3h"]) ? (forecast.rain["3h"] / 3) * 100 : 0; // Calculate percentage of rain
            rainElement.textContent = "Rain: " + rainPercentage.toFixed(1) + "%";


            const humidityElement = document.querySelectorAll(".c" + (i + 1) + " li")[3];
            humidityElement.textContent = "Humidity: " + forecast.main.humidity + "%";
        }
    }

        function updateWeatherDisplay(data) {
            Loc.innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "% Humidity";
            document.querySelector(".rain").innerHTML = data.clouds.all + "% Rain";
            if (data.weather && data.weather.length > 0) {
                const weatherCondition = data.weather[0].main;
                if (weatherCondition === "Clouds") {
                    document.querySelector(".situ").innerHTML = "Cloudy";
                } else if (weatherCondition === "Rain" || weatherCondition === "Drizzle") {
                    document.querySelector(".situ").innerHTML = "Raining";
                } else {
                    document.querySelector(".situ").innerHTML = "Clear";
                }
            } else {
                document.querySelector(".situ").innerHTML = "Unknown";
            }
        }

        searchbtn.addEventListener("click", () => {
            checkWeather(searchval.value);
        });

        searchval.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                searchbtn.click();
            }
        });
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
                console.log(showPosition)
            } else {
                locationDisplay.innerHTML = "Geolocation is not supported by this browser.";
            }
        }
        function formatTime(timestamp) {
            const date = new Date(timestamp * 1000);
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        function showPosition(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(`${geocodeApiUrl}?lat=${latitude}&lon=${longitude}&limit=1&appid=${apikey}`)
                .then((response) => response.json())
                .then((data) => {
                    const city = data[0].name;
                    console.log(city)
                    Loc.innerHTML = city;
                    checkWeather(city);
                })
                .catch((error) => {
                    Loc.innerHTML = "Unable to retrieve location data.";
                    console.error(error);
                });
        }


        getLocation()

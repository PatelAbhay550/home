const Loc = document.getElementById("name");
        const Temp = document.querySelector(".temp");
        const Rain = document.querySelector(".rain");
        const Hum = document.querySelector(".humidity");
        const Situ = document.querySelector(".situ");
        const geocodeApiUrl = "https://api.openweathermap.org/geo/1.0/reverse";
        const searchval = document.getElementById("winp");
        const apikey = "863242cfb2b1d357e6093d9a4df19a4b";
        const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

        function checkWeather(city) {
            fetch(apiurl + city + `&appid=${apikey}`)
                .then((response) => response.json())
                .then((data) => {
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
            // Your existing forecast card updates
        }

        function updateWeatherDisplay(data) {
            Loc.innerHTML = data.name;
            Temp.innerHTML = Math.round(data.main.temp) + "°C";
            Hum.innerHTML = data.main.humidity + "% Humidity";
            Rain.innerHTML = data.clouds.all + "% Rain";

            if (data.weather && data.weather.length > 0) {
                const weatherCondition = data.weather[0].main;
                if (weatherCondition === "Clouds") {
                    Situ.innerHTML = "Cloudy";
                } else if (weatherCondition === "Rain" || weatherCondition === "Drizzle") {
                    Situ.innerHTML = "Raining";
                } else {
                    Situ.innerHTML = "Clear";
                }
            } else {
                Situ.innerHTML = "Unknown";
            }
        }

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                Loc.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function showPosition(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(`${geocodeApiUrl}?lat=${latitude}&lon=${longitude}&limit=1&appid=${apikey}`)
                .then((response) => response.json())
                .then((data) => {
                    const city = data[0].name;
                    Loc.innerHTML = city;
                    checkWeather(city);
                })
                .catch((error) => {
                    Loc.innerHTML = "Unable to retrieve location data.";
                    console.error(error);
                });
        }

        function updateWeatherByDefault() {
            getLocation();
        }

        updateWeatherByDefault();

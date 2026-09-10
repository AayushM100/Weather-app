// ========================================
// DOM ELEMENTS
// ========================================

// IDs
const grantAccessBtn = document.getElementById("grant-access-btn");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");


// Classes
const wrapper = document.querySelector(".wrapper");
const tabContainer = document.querySelector(".tab-container");
const tabs = document.querySelectorAll(".tab");

const weatherContainer = document.querySelector(".weather-container");

const grantLocation = document.querySelector(".grant-location");
const searchWeather = document.querySelector(".search-weather");

const loadingScreen = document.querySelector(".loading-screen");

const userInfoContainer = document.querySelector(".user-info-container");

const nameContainer = document.querySelector(".name");

const cardContainer = document.querySelector(".card-container");
const cards = document.querySelectorAll(".card");


// Custom attributes
const yourWeatherTab = document.querySelector(
    '[data-category="your-weather"]'
);

const searchWeatherTab = document.querySelector(
    '[data-category="search-weather"]'
);

const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");

const weatherDesc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");

const temperature = document.querySelector("[data-temp]");

const windspeed = document.querySelector("[data-windspeed]");
const humidity = document.querySelector("[data-humidity]");
const clouds = document.querySelector("[data-clouds]");



// ========================================
// CURRENT TAB
// ========================================

let currentTab = yourWeatherTab;


// ========================================
// INITIAL SETUP
// ========================================

currentTab.classList.add("current-tab");

getFromSessionStorage();


// ========================================
// TAB SWITCHING
// ========================================

function switchTab(clickedTab) {

    if (clickedTab !== currentTab) {

        currentTab.classList.remove("current-tab");

        currentTab = clickedTab;

        currentTab.classList.add("current-tab");


        // Your Weather tab
        if (clickedTab === yourWeatherTab) {

            searchWeather.classList.remove("active");

            userInfoContainer.classList.remove("active");

            getFromSessionStorage();

        }


        // Search Weather tab
        else {

            grantLocation.classList.remove("active");

            userInfoContainer.classList.remove("active");

            searchWeather.classList.add("active");

        }

    }

}


// ========================================
// TAB EVENTS
// ========================================

yourWeatherTab.addEventListener("click", () => {

    switchTab(yourWeatherTab);

});


searchWeatherTab.addEventListener("click", () => {

    switchTab(searchWeatherTab);

});


// ========================================
// SESSION STORAGE
// ========================================

function getFromSessionStorage() {

    const localCoordinates =
        sessionStorage.getItem("user-coordinates");


    if (!localCoordinates) {

        grantLocation.classList.add("active");

    }

    else {

        const coordinates =
            JSON.parse(localCoordinates);

        fetchUserWeatherInfo(coordinates);

    }

}


// ========================================
// FETCH WEATHER USING LOCATION
// ========================================

async function fetchUserWeatherInfo(coordinates) {

    const { lat, lon } = coordinates;


    grantLocation.classList.remove("active");

    loadingScreen.classList.add("active");

    userInfoContainer.classList.remove("active");


    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );


        if (!response.ok) {

            throw new Error("Weather data could not be fetched");

        }


        const data = await response.json();


        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }


    catch (err) {

        loadingScreen.classList.remove("active");

        grantLocation.classList.add("active");

        alert("Error fetching weather data. Please try again later.");

        console.error(err);

    }

}


// ========================================
// RENDER WEATHER INFORMATION
// ========================================

function renderWeatherInfo(weatherInfo) {

    cityName.innerText = weatherInfo?.name;


    // Country flag
    const country =
        weatherInfo?.sys?.country?.toLowerCase();

    countryIcon.src =
        `https://flagcdn.com/16x12/${country}.png`;


    // Weather description
    weatherDesc.innerText =
        weatherInfo?.weather?.[0]?.description;


    // Weather icon
    const icon =
        weatherInfo?.weather?.[0]?.icon;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;


    // Temperature
    temperature.innerText =
        `${Math.round(weatherInfo?.main?.temp)}°C`;


    // Wind speed
    windspeed.innerText =
        `${weatherInfo?.wind?.speed} m/s`;


    // Humidity
    humidity.innerText =
        `${weatherInfo?.main?.humidity}%`;


    // Clouds
    clouds.innerText =
        `${weatherInfo?.clouds?.all}%`;

}


// ========================================
// GET USER LOCATION
// ========================================

function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            showPosition,
            showLocationError
        );

    }

    else {

        alert(
            "Geolocation is not supported by this browser."
        );

    }

}


// ========================================
// GRANT ACCESS BUTTON
// ========================================

grantAccessBtn.addEventListener("click", getLocation);


// ========================================
// SHOW POSITION
// ========================================

function showPosition(position) {

    const { latitude, longitude } =
        position.coords;


    const coordinates = {

        lat: latitude,

        lon: longitude

    };


    sessionStorage.setItem(
        "user-coordinates",
        JSON.stringify(coordinates)
    );


    fetchUserWeatherInfo(coordinates);

}


// ========================================
// LOCATION ERROR
// ========================================

function showLocationError(error) {

    if (error.code === 1) {

        alert(
            "Location permission was denied. Please allow location access."
        );

    }

    else if (error.code === 2) {

        alert(
            "Your location could not be determined."
        );

    }

    else if (error.code === 3) {

        alert(
            "Location request timed out."
        );

    }

    else {

        alert(
            "Unable to get your location."
        );

    }

}


// ========================================
// SEARCH BUTTON
// ========================================

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();


    if (city === "") {

        alert("Please enter a city name.");

    }

    else {

        fetchSearchWeatherInfo(city);

    }

});


// ========================================
// SEARCH USING ENTER
// ========================================

cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();


        if (city === "") {

            alert("Please enter a city name.");

        }

        else {

            fetchSearchWeatherInfo(city);

        }

    }

});


// ========================================
// FETCH SEARCH WEATHER
// ========================================

async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");

    userInfoContainer.classList.remove("active");

    grantLocation.classList.remove("active");


    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );


        if (!response.ok) {

            if (response.status === 404) {

                throw new Error("City not found");

            }

            throw new Error(
                "Unable to fetch weather data"
            );

        }


        const data = await response.json();


        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }


    catch (err) {

        loadingScreen.classList.remove("active");

        searchWeather.classList.add("active");

        alert(
            "City not found. Please enter a valid city name."
        );

        console.error(err);

    }

}
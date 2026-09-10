// =====================================================
// WEATHER APP - BACKEND
// =====================================================

// Import packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


// Load environment variables
dotenv.config({ path: __dirname + "/.env" });

console.log("API KEY LOADED:", !!process.env.API_KEY);


// Create Express app
const app = express();


// Enable CORS
app.use(cors());


// Allow JSON data
app.use(express.json());


// Port
const PORT = 3000;


// =====================================================
// WEATHER API ROUTE
// =====================================================

app.get("/api/weather", async function(req, res) {

    const city = req.query.city;

    if (!city) {
        return res.status(400).json({
            error: "Please enter a city."
        });
    }

    const apiKey = process.env.API_KEY;

    const apiURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || "Weather data unavailable."
            });
        }

        res.json(data);

    } catch (error) {
        console.log("Weather API error:", error);

        res.status(500).json({
            error: "Unable to fetch weather data."
        });
    }
});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, function() {

    console.log(
        `Weather backend running at http://localhost:${PORT}`
    );

});
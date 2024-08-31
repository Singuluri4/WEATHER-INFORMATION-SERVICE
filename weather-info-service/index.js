// index.js
const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Replace with your Weatherstack API key
const API_KEY = process.env.WEATHERSTACK_API_KEY;
const BASE_URL = 'http://api.weatherstack.com/current';

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'Please provide a city' });
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                access_key: API_KEY,
                query: city
            }
        });

        const weatherData = response.data;

        if (weatherData.error) {
            return res.status(404).json({ error: 'City not found or API error' });
        }

        res.json({
            location: weatherData.location.name,
            temperature: weatherData.current.temperature,
            wind_speed: weatherData.current.wind_speed,
            humidity: weatherData.current.humidity,
            feelslike: weatherData.current.feelslike
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

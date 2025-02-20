const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Enable CORS (Allows frontend to fetch data)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Path to store the daily code
const DAILY_CODE_PATH = path.join(__dirname, "daily-code.json");

// Function to generate a new unique 5-digit code
function generateUniqueCode() {
    let firstTwoDigits = Math.floor(Math.random() * 8) + 2; // 2-9
    let lastThreeDigits = Math.floor(Math.random() * 1000); // 000-999
    return `${firstTwoDigits}${String(lastThreeDigits).padStart(3, '0')}`;
}

// Function to update the daily code if it's a new day
function updateDailyCode() {
    let now = new Date();

    // Convert current time to Jakarta timezone (UTC+7)
    let jakartaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));

    let dailyCodeData = { code: generateUniqueCode(), lastUpdated: jakartaTime.toISOString() };

    // Check if daily-code.json exists
    if (fs.existsSync(DAILY_CODE_PATH)) {
        let existingData = JSON.parse(fs.readFileSync(DAILY_CODE_PATH, "utf-8"));

        // If it's still the same day in Jakarta, keep the existing code
        if (new Date(existingData.lastUpdated).toDateString() === jakartaTime.toDateString()) {
            return;
        }
    }

    // Save the new daily code
    fs.writeFileSync(DAILY_CODE_PATH, JSON.stringify(dailyCodeData, null, 2));
}

// Run updateDailyCode when the server starts
updateDailyCode();

// API to get the daily code
app.get("/daily-code", (req, res) => {
    if (!fs.existsSync(DAILY_CODE_PATH)) {
        return res.status(404).json({ error: "Daily code not found" });
    }
    
    let dailyCode = JSON.parse(fs.readFileSync(DAILY_CODE_PATH, "utf-8"));
    res.json({ code: dailyCode.code });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

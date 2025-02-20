// Fetch and display the daily code (Admin only)
async function fetchDailyCode() {
    try {
        let response = await fetch('http://localhost:3000/daily-code');
        let data = await response.json();
        document.getElementById("codeBox").textContent = data.code;
    } catch (error) {
        console.error("Error fetching daily code:", error);
        document.getElementById("codeBox").textContent = "Error!";
    }
}

// Run this on page load
fetchDailyCode();

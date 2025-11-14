# 🌌 Celestial — NASA Space Exploration Dashboard

**Celestial** is an educational and interactive space-themed web application that brings NASA’s open data to your fingertips. Explore high-resolution space imagery, discover new planets, and track the International Space Station — all in one immersive dashboard.



## ✨ Features

- 📸 **Astronomy Picture of the Day (APOD)**  
  Discover NASA’s daily photo with an explanation from astronomers.

- 🌍 **EPIC Earth Imagery**  
  Browse real-time Earth photos taken by the DSCOVR satellite.

- 🔭 **Exoplanet Explorer** *(Coming Soon)*  
  Explore planets discovered outside our solar system with key stats.

- 🚘 **Mars Rover Photos**  
  View raw images from NASA’s Curiosity, Opportunity, and Perseverance rovers.

- 🛰️ **ISS Tracker**  
  Track the live location of the International Space Station (ISS) over Earth.

---

## 🛠️ Tech Stack

- **Frontend**:  
  HTML • CSS • Bootstrap 5 • EJS Templates

- **Backend**:  
  Node.js • Express.js

- **APIs Used**:
  - [NASA APOD API](https://api.nasa.gov/)
  - [NASA Mars Rover API](https://api.nasa.gov/)
  - [NASA EPIC API](https://epic.gsfc.nasa.gov/)
  - [NASA Exoplanet Archive API](https://exoplanetarchive.ipac.caltech.edu/)
  - [Open Notify ISS API](http://open-notify.org/)
  - [Mapbox API](https://www.mapbox.com/)



---

## 🧠 Inspiration

This project was built to explore public space data and showcase real-time space events in a clean and educational UI. Ideal for students, enthusiasts, and anyone fascinated by the cosmos.

---

## 🔒 Environment Variables

To run this app, create a `.env` file in the root and add:

**Required:**
- `NASA_API_KEY` - Your NASA API key (get one at https://api.nasa.gov/)
- `MAP_TOKEN` - Your Mapbox token (for ISS tracker)

**Optional:**
- `PORT` - Server port (defaults to 3000)
- `PUBLIC_URL` - Public URL for cron job keep-alive (required in production)
- `NODE_ENV` - Set to "production" for production deployment


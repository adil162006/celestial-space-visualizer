const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//API Key and URL for NASA's Astronomy Picture of the Day (APOD)
const api = process.env.NASA_API_KEY




// Routes
app.get("/", (req, res) => {
    res.render("show/home");
});
//apod route
app.get("/apod", (req, res) => {
    res.render("show/apod");
});
app.post("/apod/info", async(req,res)=>{
    const url=`https://api.nasa.gov/planetary/apod?api_key=${api}`
    let {date}= req.body;
    try{
        let response = await fetch(`${url}&date=${date}`);
        let data = await response.json();
        console.log(data);
        
        res.render("results/apod",{data})
    }
    catch(err){
        console.error("Error fetching data from NASA API:", err);
        res.status(500).send("Internal Server Error");
    }

})
//epic route
app.get("/epic",(req,res)=>{
    res.render("show/epic")

})
app.post("/epic/info", async (req, res) => {
    const date = req.body.date; // Destructure properly
    const url = `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${api}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Build image URLs
        const datas = data.map(item => {
            const [year, month, day] = item.date.split(' ')[0].split('-');
            return {
                caption: item.caption,
                date: item.date,
                url: `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${item.image}.jpg`
            };
        });

        res.render("results/epic", { datas });

    } catch (err) {
        console.error("Error fetching data from NASA EPIC API:", err);
        res.status(500).send("Internal Server Error");
    }
});
//Exoplanet
app.get("/exoplanets",async(req,res)=>{
    const url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,disc_year,pl_orbper,pl_rade+from+pscomppars+where+disc_year%3E2015&format=json";
    
    try{
        let response = await fetch(url)
        let data = await response.json()
        res.render("show/exoplanet",{data})
    }catch(err){
        console.error("Error fetching data from NASA Exoplanet Archive:", err);
        res.status(500).send("Internal Server Error");
    }


})


//rover route
app.get("/rover",(req,res)=>{
    res.render("show/rover")
})
app.post("/rover/info",(req,res)=>{
    // const url = 
})


// Server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

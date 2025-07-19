require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require("passport-local")
const User = require('./models/user');
const { saveRedirectUrl, isLoggedIn, validateDateNotInFuture } = require('./middleware');


app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



// EJS Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//API Key and URL for NASA's Astronomy Picture of the Day (APOD)
const api = process.env.API_KEY;

main().then(()=>{
    console.log("connected to db");
    
}).catch(err=>{
    console.log(err);
    
})


async function main (){
    await mongoose.connect('mongodb://127.0.0.1:27017/celestia');
    
}
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
    
  }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.get("/", (req, res) => {
    console.log(req.user);
    
    res.render("show/home");
});
//apod route
app.get("/apod", (req, res) => {
    res.render("show/apod");
});
app.post("/apod/info", 
    isLoggedIn,
    validateDateNotInFuture,
    async(req,res)=>{
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
app.post("/epic/info",
     isLoggedIn,
     validateDateNotInFuture ,
    async (req, res) => {
    const date = req.body.date;
    const url = `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${api}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // ✅ Check if the response is an array
        if (!Array.isArray(data)) {
            req.flash("error", "No EPIC data available for the selected date.");
            return res.redirect("/epic");
        }

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
        req.flash("error", "An error occurred while fetching EPIC data.");
        res.redirect("/epic");
    }
});

//Exoplanet
app.get("/exoplanets",isLoggedIn,async(req,res)=>{
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
app.post("/rover/info",
    isLoggedIn,
    validateDateNotInFuture,
    async(req,res)=>{
    let {date,rover}=req.body
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${api}`
    try{
        let response = await fetch(url)
        let result = await response.json()
        let data = result.photos || [];
        res.render("results/rover",{data})
    }
    catch(err){
        console.error("Error fetching data from NASA Rover Archive:", err);
        res.status(500).send("Internal Server Error");
    }
})
//ISS locator
app.get("/iss",isLoggedIn,async(req,res)=>{

    const url = "https://api.wheretheiss.at/v1/satellites/25544"

    try{
        let response = await fetch(url)
        let data = await response.json()
        res.render("show/iss",{data,MAP_TOKEN: process.env.MAP_TOKEN})

    }catch(err){
        console.error("Error fetching data from NASA  Archive:", err);
        res.status(500).send("Internal Server Error");

    }

})

//signup , login , logout 


//signup
app.get("/signup",(req,res)=>{
    res.render("users/signup")
})
app.post("/signup", async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err); // important!
            req.flash("success", "Welcome to celestia!");
            return res.redirect("/");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
})

//login
app.get("/login",(req, res) => {
    res.render("users/login");
}
)

app.post("/login",
    saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login' }),
    
    (req, res) => {
        const redirectUrl = res.locals.redirectUrl || "/"; // ✅ define it
        req.flash("success", "Welcome back!");
        return res.redirect(redirectUrl);
    }
);

//logout

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully");
        return res.redirect("/");
    });
});


app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
    let { status=500,message="some error occured"}=err
    res.status(status).render("error.ejs",{err})
    // res.send("Something went wrong");
})

// Server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

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
const apodRouter = require("./routes/apod.js")
const epicRouter = require("./routes/epic.js")
const exoplanetRouter = require("./routes/exoplanet.js")
const issRouter = require("./routes/iss.js")
const roverRouter = require("./routes/rover.js")
const usersRouter = require("./routes/users.js")


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
app.use("/apod", apodRouter)
//epic route
app.use("/epic", epicRouter);

//Exoplanet
app.use("/exoplanet", exoplanetRouter)


//rover route
app.use("/rover", roverRouter);
//ISS locator
app.use("/iss", issRouter);

//signup , login , logout 


const authRoutes = require("./routes/users.js");
app.use("/", authRoutes);



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

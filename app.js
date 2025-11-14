require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const apodRouter = require("./routes/apod.js");
const epicRouter = require("./routes/epic.js");
const exoplanetRouter = require("./routes/exoplanet.js");
const issRouter = require("./routes/iss.js");
const roverRouter = require("./routes/rover.js");
const { job } = require('./utils/cron.js');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// EJS Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set safe defaults for templates
app.use((req, res, next) => {
    res.locals.currentUser = null;
    res.locals.success = [];
    res.locals.error = [];
    next();
});

// Start cron job in production
if (process.env.NODE_ENV === "production") {
    job.start();
}

// Routes
app.get("/", (req, res) => {
    res.render("show/home");
});

app.use("/apod", apodRouter);
app.use("/epic", epicRouter);
app.use("/exoplanet", exoplanetRouter);
app.use("/rover", roverRouter);
app.use("/iss", issRouter);



// 404 handler
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Some error occurred" } = err;
    res.status(status).render("error.ejs", { err });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

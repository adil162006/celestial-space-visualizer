const api = process.env.NASA_API_KEY

module.exports.showRover = (req,res)=>{
    res.render("show/rover")
}

module.exports.resultRover = async(req,res)=>{
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
        res.status(500).render("error.ejs", {
            err: { status: 500, message: "Error fetching data from NASA Rover API. Please try again later." }
        });
    }
}
const api = process.env.NASA_API_KEY

module.exports.showEXO = async(req,res)=>{
    const url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,disc_year,pl_orbper,pl_rade+from+pscomppars+where+disc_year%3E2015&format=json";
    
    try{
        let response = await fetch(url)
        let data = await response.json()
        res.render("show/exoplanet",{data})
    }catch(err){
        console.error("Error fetching data from NASA Exoplanet Archive:", err);
        res.status(500).render("error.ejs", {
            err: { status: 500, message: "Error fetching data from Exoplanet Archive. Please try again later." }
        });
    }


}
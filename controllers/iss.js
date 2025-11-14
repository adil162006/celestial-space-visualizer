

module.exports.showISS = async(req,res)=>{

    const url = "https://api.wheretheiss.at/v1/satellites/25544"

    try{
        let response = await fetch(url)
        let data = await response.json()
        res.render("show/iss",{data,MAP_TOKEN: process.env.MAP_TOKEN})

    }catch(err){
        console.error("Error fetching data from ISS API:", err);
        res.status(500).render("error.ejs", {
            err: { status: 500, message: "Error fetching ISS location data. Please try again later." }
        });
    }

}


module.exports.showISS = async(req,res)=>{

    const url = "https://api.wheretheiss.at/v1/satellites/25544"

    try{
        let response = await fetch(url)
        let data = await response.json()
        res.render("show/iss",{data,MAP_TOKEN: process.env.MAP_TOKEN})

    }catch(err){
        console.error("Error fetching data from NASA  Archive:", err);
        res.status(500).send("Internal Server Error");

    }

}
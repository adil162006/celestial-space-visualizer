const api = process.env.NASA_API_KEY


module.exports.showAPOD = (req, res) => {
    res.render("show/apod");
};

module.exports.resultAPOD =  async(req,res)=>{
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
        res.status(500).render("error.ejs", {
            err: { status: 500, message: "Error fetching data from NASA API. Please try again later." }
        });
    }

}
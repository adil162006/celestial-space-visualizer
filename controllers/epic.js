const api = process.env.NASA_API_KEY

module.exports.showEPIC = (req,res)=>{
    res.render("show/epic")

}

module.exports.resultEPIC =  async (req, res) => {
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
}

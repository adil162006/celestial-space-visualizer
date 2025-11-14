const cron = require("cron");
const https = require("https");

const job = new cron.CronJob("*/14 * * * *", function () {
  const publicUrl = process.env.PUBLIC_URL || process.env.API_URL;
  
  if (!publicUrl) {
    console.log("PUBLIC_URL not set, skipping cron job");
    return;
  }

  https
    .get(publicUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully to", publicUrl);
      } else {
        console.log("GET request failed with status", res.statusCode);
      }
      res.resume(); // prevent memory leaks
    })
    .on("error", (e) => console.error("Error while sending request", e));
});

// Don't start automatically - will be started in app.js for production
// job.start();

module.exports = { job };

const functions = require("firebase-functions");
const https = require("https");

exports.searchJobs = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  const { query, category, country, page } = req.query;

  const params = new URLSearchParams({
    app_id: "8fb23083",
    app_key: "e8bb9d5a84ed5946726bd4257fdd6bbd",
    results_per_page: "20",
    page: page || "1",
    what: query || "developer",
    where: country || "ca",
    ...(category && { category }),
  });

  const url = `https://api.adzuna.com/v1/api/jobs/${country || "ca"}/search/${page || "1"}?${params}`;

  https.get(url, (apiRes) => {
    let data = "";
    apiRes.on("data", (chunk) => { data += chunk; });
    apiRes.on("end", () => {
      res.set("Content-Type", "application/json");
      res.status(200).send(data);
    });
  }).on("error", (err) => {
    res.status(500).send({ error: err.message });
  });
});
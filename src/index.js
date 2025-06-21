const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async (req, res) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    return res.end();
  }

  const { url } = req.query;
  if (!url) {
    res.writeHead(400, { ...cors, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Missing 'url' query parameter" }));
  }

  try {
    const response = await fetch(`https://megafetch.hideme.eu.org/?url=${encodeURIComponent(url)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await response.json();
    res.writeHead(200, { ...cors, "Content-Type": "application/json" });
    return res.end(JSON.stringify(data));
  } catch (err) {
    res.writeHead(500, { ...cors, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Fetch error", message: err.message }));
  }
};

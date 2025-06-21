export default async function handler(req) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const urlObj = new URL(req.url);
  const target = urlObj.searchParams.get("url");

  if (!target) {
    return new Response(
      JSON.stringify({ error: "Missing 'url' query parameter" }),
      { status: 400, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const api = `https://megafetch.hideme.eu.org/?url=${encodeURIComponent(target)}`;

  try {
    const r = await fetch(api, {
      headers: { "User-Agent": "Mozilla/5.0 Edge-Proxy" }
    });
    if (!r.ok) throw new Error(`API responded: ${r.status}`);

    const data = await r.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Fetch failed", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
}

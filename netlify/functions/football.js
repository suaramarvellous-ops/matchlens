exports.handler = async function (event) {
  const API_TOKEN = process.env.FOOTBALL_DATA_API_KEY;

  if (!API_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Football API key is not configured in Netlify."
      })
    };
  }

  const params = new URLSearchParams(event.queryStringParameters || {});
  const endpoint = params.get("endpoint") || "matches";

  const allowedEndpoints = [
    "matches",
    "competitions/PL/matches",
    "competitions/PD/matches",
    "competitions/BL1/matches",
    "competitions/SA/matches",
    "competitions/FL1/matches"
  ];

  if (!allowedEndpoints.includes(endpoint)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Unsupported endpoint." })
    };
  }

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/${endpoint}`,
      {
        headers: { "X-Auth-Token": API_TOKEN }
      }
    );

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 502,
      body: JSON.stringify({
        error: "Could not retrieve football data."
      })
    };
  }
};

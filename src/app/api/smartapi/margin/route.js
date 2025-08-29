import { NextResponse } from 'next/server';
import { SmartAPI } from 'smartapi-javascript';

export async function POST(req) {
  try {
    const { positions } = await req.json();
    console.log("Received positions:", positions);

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8888"
        : process.env.SITE_URL; // set this in Netlify settings

    const sessionRes = await fetch(`${baseUrl}/.netlify/functions/ensureSession`, {
      method: "GET",
    });

    if (!sessionRes.ok) {
      const text = await sessionRes.text();
      console.error("ensureSession failed:", sessionRes.status, text);
      throw new Error(`Failed to get session. Status ${sessionRes.status}`);
    }

    const sessionJson = await sessionRes.json();
    console.log("Session response:", sessionJson);

    const sessionData = sessionJson.session;

    if (!sessionData?.jwt_token) {
      console.error("No valid session token:", sessionData);
      throw new Error("No valid session token from ensureSession");
    }

    // --- create smartAPI instance with token ---
    const smartAPI = new SmartAPI({ api_key: process.env.SMARTAPI_KEY });
    smartAPI.access_token = sessionData.jwt_token;

    // --- calculate margin ---
    const margin = await smartAPI.marginApi({ positions });
    console.log("Margin API result:", margin);

    return NextResponse.json(margin);
  } catch (error) {
    console.error("Margin API error:", error);

    return NextResponse.json(
      {
        error: "Failed to get margin",
        message: error.message || null,
        stack: error.stack || null,
      },
      { status: 500 }
    );
  }
}








// netlify/functions/storeSession.js
import { createClient } from "@supabase/supabase-js";
import { SmartAPI } from "smartapi-javascript";
import { authenticator } from "otplib";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role required for insert/update
);

const smartAPI = new SmartAPI({
  api_key: process.env.SMARTAPI_KEY,
});

// Utility: get or refresh SmartAPI session
async function ensureSession() {
  let session;

  try {
    // Try login with TOTP
    const login = await smartAPI.generateSession(
      process.env.SMARTAPI_CLIENT_CODE,
      process.env.SMARTAPI_PASSWORD,
      authenticator.generate(process.env.SMARTAPI_TOTP_SECRET)
    );

    session = login.data; // { jwtToken, refreshToken, feedToken, ... }
    smartAPI.access_token = session.jwtToken;
  } catch (err) {
    console.error("SmartAPI login failed:", err);
    throw err;
  }

  return session;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const session = await ensureSession();

    console.log(session);

    // Save into Supabase (overwrite row id = 1)
    const { data, error } = await supabase
      .from("sessions")
      .upsert(
        {
          id: 1,
          jwt_token: session.jwtToken,
          refresh_token: session.refreshToken,
          feed_token: session.feedToken,
          state: session.state || null,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h from now
        },
        { onConflict: ["id"] }
      )
      .select();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, session: data }),
    };
  } catch (err) {
    console.error("Error storing session:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

// netlify/functions/getSession.js
import { createClient } from "@supabase/supabase-js";
import { SmartAPI } from "smartapi-javascript";
import { authenticator } from "otplib";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const smartAPI = new SmartAPI({
  api_key: process.env.SMARTAPI_KEY,
});

// Utility: do a full SmartAPI login
async function fullLogin() {
  const login = await smartAPI.generateSession(
    process.env.SMARTAPI_CLIENT_CODE,
    process.env.SMARTAPI_PASSWORD,
    authenticator.generate(process.env.SMARTAPI_TOTP_SECRET)
  );
  return login.data;
}

export async function handler(event) {
  try {
    // Always fetch the single session row (id = 1)
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) throw error;

    let session = data;
    let expired =
      !session?.expires_at || new Date(session.expires_at) <= new Date();

    if (expired) {
      console.log("Session expired, trying refresh...");

      try {
        // Try refresh first
        const refreshed = await smartAPI.generateSessionByRefreshToken(
          session.refresh_token
        );

        session = {
          id: 1,
          jwt_token: refreshed.data.jwtToken,
          refresh_token: refreshed.data.refreshToken,
          feed_token: refreshed.data.feedToken,
          state: refreshed.data.state || null,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };

        await supabase.from("sessions").upsert(session, { onConflict: ["id"] });
      } catch (err) {
        console.log("Refresh failed, doing full login...");

        const loginData = await fullLogin();
        session = {
          id: 1,
          jwt_token: loginData.jwtToken,
          refresh_token: loginData.refreshToken,
          feed_token: loginData.feedToken,
          state: loginData.state || null,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };

        await supabase.from("sessions").upsert(session, { onConflict: ["id"] });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ session }),
    };
  } catch (err) {
    console.error("getSession error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

// netlify/functions/ensureSession.js
import { createClient } from "@supabase/supabase-js";
// import SmartAPI  from "smartapi-javascript";
import { authenticator } from "otplib";


const { SmartAPI } = require("smartapi-javascript");

// ---- Supabase ----
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

// ---- SmartAPI ----
const smartAPI = new SmartAPI({
  api_key: process.env.SMARTAPI_KEY,
});

// Store/update session in Supabase safely
async function saveSession(session) {
  if (!session) throw new Error("No session data to save");

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const { data, error } = await supabase
    .from("sessions")
    .upsert(
      [
        {
          id: 1, // force single row
          jwt_token: session?.jwtToken || session?.JwtToken || session?.jwt_token || null,
          refresh_token: session?.refreshToken || session?.RefreshToken || session?.refresh_token || null,
          feed_token: session?.feedToken || session?.FeedToken || session?.feed_token || null,
          state: session?.state || null,
          created_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        },
      ],
      { onConflict: "id" }
    )
    .select()
    .single();
    if(data) console.log(data)

  if (error) throw error;
  return data;
}

// Get latest session from Supabase
async function getStoredSession() {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", 1)
    .single();

  if (error && error.code !== "PGRST116") throw error; // ignore "no rows"
  return data || null;
}

export async function handler() {
  try {
    let session = await getStoredSession();
    console.log("Stored session:", session);

    // Step 1: validate existing session
    if (session?.jwt_token && new Date(session.expires_at) > new Date()) {
      smartAPI.access_token = session.jwt_token;
      try {
        await smartAPI.getProfile();
        return { statusCode: 200, body: JSON.stringify({ session }) };
      } catch (err) {
        console.log("Existing token invalid:", err.message);
      }
    }

    // Step 2: try refresh
    if (session?.refresh_token) {
      try {
        const refreshed = await smartAPI.generateSessionByRefreshToken(session.refresh_token);
        if (!refreshed?.data) {
          console.log("Refresh response invalid:", refreshed);
        } else {
          const stored = await saveSession(refreshed.data);
          smartAPI.access_token = refreshed.data.jwtToken || refreshed.data.JwtToken;
          return { statusCode: 200, body: JSON.stringify({ session: stored }) };
        }
      } catch (err) {
        console.log("Refresh failed:", err.message);
      }
    }

    // Step 3: full login
    const login = await smartAPI.generateSession(
      process.env.SMARTAPI_CLIENT_CODE,
      process.env.SMARTAPI_PASSWORD,
      authenticator.generate(process.env.SMARTAPI_TOTP_SECRET)
    );

    if (!login?.data) {
      console.log("Login response invalid:", login);
      throw new Error("Login response invalid");
    }

    console.log("Login successful:", login.data);
    const stored = await saveSession(login.data);
    smartAPI.access_token = login.data.jwtToken || login.data.JwtToken;

    return { statusCode: 200, body: JSON.stringify({ session: stored }) };
  } catch (err) {
    console.error("EnsureSession error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

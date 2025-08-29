import { SmartAPI } from 'smartapi-javascript';
import fs from 'fs/promises';
import path from 'path';
import { authenticator } from 'otplib';

const sessionFile = path.join(process.cwd(), 'smartapi_session.json');

const smartAPI = new SmartAPI({
  api_key: process.env.SMARTAPI_KEY,
});

async function readSession() {
  try {
    const raw = await fs.readFile(sessionFile, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function saveSession(session) {
  await fs.writeFile(sessionFile, JSON.stringify(session, null, 2));
}

async function ensureSession() {
  let session = await readSession();

  // Try validate existing token
  if (session?.jwtToken) {
    smartAPI.access_token = session.jwtToken;
    try {
      await smartAPI.getProfile();
      return smartAPI;
    } catch (err) {
      console.log("Existing token invalid, trying refresh...");
    }
  }

  // Try refresh
  if (session?.refreshToken) {
    try {
      const refreshed = await smartAPI.generateSessionByRefreshToken(session.refreshToken);
      await saveSession(refreshed.data);
      smartAPI.access_token = refreshed.data.jwtToken;
      return smartAPI;
    } catch (err) {
      console.log("Refresh failed, falling back to full login...");
    }
  }

  // Full login
  const login = await smartAPI.generateSession(
    process.env.SMARTAPI_CLIENT_CODE,
    process.env.SMARTAPI_PASSWORD,
    authenticator.generate(process.env.SMARTAPI_TOTP_SECRET)
  );

  await saveSession(login.data);
  smartAPI.access_token = login.data.jwtToken;
  return smartAPI;
}

export { ensureSession };

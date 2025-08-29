// netlify/functions/fetchAndSegmentSymbols.js
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const MASTER_URL =
  "https://margincalculator.angelone.in/OpenAPI_File/files/OpenAPIScripMaster.json";

export async function handler() {
  try {
    // 1. Fetch master data
    const response = await fetch(MASTER_URL);
    const data = await response.json();

    console.log(`Fetched ${data.length} instruments`);

    // 2. Group by exch_seg
    const grouped = {};
    for (const row of data) {
      const seg = row.exch_seg;
      if (!grouped[seg]) grouped[seg] = [];
      grouped[seg].push(row);
    }

    // 3. Upload each group to Supabase storage
    for (const [seg, rows] of Object.entries(grouped)) {
      const { error } = await supabase.storage
        .from("symbols") // create bucket "symbols"
        .upload(`${seg}.json`, JSON.stringify(rows), {
          contentType: "application/json",
          upsert: true,
        });

      if (error) {
        console.error(`Upload failed for ${seg}:`, error.message);
      } else {
        console.log(`Uploaded ${seg}.json with ${rows.length} rows`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Symbols segmented and uploaded",
        segments: Object.fromEntries(
          Object.entries(grouped).map(([seg, rows]) => [seg, rows.length])
        ),
      }),
    };
  } catch (err) {
    console.error("Error:", err);
    return { statusCode: 500, body: err.message };
  }
}

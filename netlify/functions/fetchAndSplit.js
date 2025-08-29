const fs = require("fs");
const path = require("path");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function () {
  try {
    const url = "https://margincalculator.angelone.in/OpenAPI_File/files/OpenAPIScripMaster.json";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const allData = await response.json();

    // Group by exch_seg
    const grouped = {};
    for (const item of allData) {
      const key = item.exch_seg || "UNKNOWN";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }

    const outputDir = path.resolve(__dirname, "../../public/my_data");
    fs.mkdirSync(outputDir, { recursive: true });

    await Promise.all(
      Object.entries(grouped).map(([seg, rows]) =>
        fs.promises.writeFile(
          path.join(outputDir, `${seg}.json`),
          JSON.stringify(rows, null, 2),
          "utf-8"
        )
      )
    );

    console.log(`✅ Created ${Object.keys(grouped).length} segment files`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Files created successfully" }),
    };
  } catch (error) {
    console.error("❌ Fetch/Processing error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to process data" }),
    };
  }
};

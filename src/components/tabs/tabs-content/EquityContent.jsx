import AssetsListTable from "@/components/tables/AssetsListTable";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// --- Supabase client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const EquityContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEquityData = async () => {
      try {
        setLoading(true);

        const { data: file, error } = await supabase
          .storage
          .from("symbols") // your bucket name
          .download("NSE.json");

        if (error) throw error;
        if (!file) throw new Error("No file returned");

        const text = await file.text();
        const json = JSON.parse(text);

        const filtered = json.filter(item => item.instrumenttype !== "AMXIDX");
        setData(filtered);
      } catch (err) {
        console.error("Failed to fetch equity data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquityData();
  }, []);

  return (
    <Box gap={12} w={{ base: "100%", lg: "60%" }}>
      <AssetsListTable data={data} />
    </Box>
  );
};

export default EquityContent;

// // import MarginForm from "@/components/forms/MarginForm"

// import AssetsListTable from "@/components/tables/AssetsListTable"
// import { Box } from "@chakra-ui/react"
// import { useEffect, useState } from "react"

// const EquityFuturesContent = () => {
//   const [data, setData] = useState([])

//   useEffect(() => {
//     const fetchEquityFuturesData = async () => {
//       const res = await fetch(`/my_data/NFO.json`)
//       const json = await res.json()
//       const filtered = json.filter(item => item.instrumenttype === "FUTSTK")
//       setData(filtered)
//     }

//     fetchEquityFuturesData()
//   }, [])

//   return (
//     <Box gap={12} w={{ base: "100%", lg: "60%" }} mb={12}>
//       <AssetsListTable data={data} />
//     </Box>
//   )
// }

// export default EquityFuturesContent


import AssetsListTable from "@/components/tables/AssetsListTable";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// --- Supabase client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const EquityFuturesContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEquityFuturesData = async () => {
      try {
        setLoading(true);
        const { data: file, error } = await supabase
          .storage
          .from("symbols") // your bucket name
          .download("NFO.json");

        if (error) throw error;
        if (!file) throw new Error("No file returned");

        const text = await file.text();
        const json = JSON.parse(text);

        const filtered = json.filter(item => item.instrumenttype === "FUTSTK");
        setData(filtered);
      } catch (err) {
        console.error("Failed to fetch equity futures data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquityFuturesData();
  }, []);

  return (
    <Box gap={12} w={{ base: "100%", lg: "60%" }} mb={12}>
      <AssetsListTable data={data} />
    </Box>
  );
};

export default EquityFuturesContent;

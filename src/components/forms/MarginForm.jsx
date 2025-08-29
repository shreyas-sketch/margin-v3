
"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react";
import Select from "react-select";
import Fuse from "fuse.js";
import SymbolAutocomplete from "../select/SymbolSelect";
import { createClient } from "@supabase/supabase-js";
// import supabase from "@/lib/supabase/supabaseClient";
 


// --- Supabase client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const exchanges = [
  { label: "NFO", value: "NFO" },
  { label: "BFO", value: "BFO" },
  { label: "CDS", value: "CDS" },
  { label: "MCX", value: "MCX" },
];

const products = [
  { label: "Futures", value: "Futures" },
  { label: "Options", value: "Options" },
];

const tradesType = [
  { label: "BUY", value: "BUY" },
  { label: "SELL", value: "SELL" },
];

const MarginForm = ({ onResult }) => {
  const [formData, setFormData] = useState({
    exchange: exchanges[0].value,
    product: products[0].value,
    symbol: null,
    quantity: "",
    strike_price: "",
    option_type: "",
    tradeType: tradesType[0].value,
    token: "",
  });

  const [symbolData, setSymbolData] = useState([]);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [lotSize, setLotSize] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Fetch symbols from Supabase bucket ---
  useEffect(() => {
    const loadSymbols = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.storage
          .from("symbols") // Bucket name in your supbase to store instruments list 
          .download(`${formData.exchange}.json`);

        if (error) throw error;
        if (!data) throw new Error("No file returned");

        const text = await data.text();
        const json = JSON.parse(text);

        const formatted = json.map((item) => ({
          label: item.symbol,
          value: item.symbol,
          ...item,
        }));

        setSymbolData(formatted);
        setFilteredSymbols(formatted);
        setFuse(
          new Fuse(formatted, {
            keys: ["symbol", "name", "instrumenttype"],
            threshold: 0.3,
          })
        );
      } catch (err) {
        console.error("Failed to load symbols from Supabase:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSymbols();
  }, [formData.exchange]);

  // --- Filter symbols by product type ---
  useEffect(() => {
    if (!formData.product) {
      setFilteredSymbols(symbolData);
      return;
    }

    const filtered = symbolData.filter((item) => {
      const instr = item.instrumenttype?.toUpperCase() || "";
      if (formData.product === "Options") return instr.startsWith("OPT");
      if (formData.product === "Futures") return instr.startsWith("FUT");
      return true;
    });

    setFilteredSymbols(filtered);
  }, [formData.product, symbolData]);

  const handleSymbolChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      symbol: val,
      exchange: val?.exch_seg || prev.exchange,
      quantity: val?.lotsize ? String(val.lotsize) : "",
      strike_price: val?.strike ? String(parseInt(val.strike / 100)) : "",
      option_type: val?.symbol?.endsWith("PE")
        ? "PUTS"
        : val?.symbol?.endsWith("CE")
        ? "CALLS"
        : "",
      token: val?.token || "",
    }));
    setLotSize(val?.lotsize || null);
  };

  // const handleSubmit = async () => {
  //   const positions =
  //     symbols.length > 0
  //       ? symbols.map((item) => ({
  //           exchange: item.exchange,
  //           qty: item.qty,
  //           productType: "INTRADAY",
  //           token: item.token,
  //           tradeType: item.tradeType,
  //           orderType: "MARKET",
  //         }))
  //       : [
  //           {
  //             exchange: formData.exchange,
  //             qty: formData.quantity || lotSize,
  //             productType: "INTRADAY",
  //             token: formData.token,
  //             tradeType: formData.tradeType,
  //             orderType: "MARKET",
  //           },
  //         ];

  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/smartapi/margin", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ positions }),
  //     });
  //     const data = await res.json();
  //     if (data && onResult) onResult(data);
  //   } catch (err) {
  //     console.error("Error fetching margin:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async () => {
    const positions =
      symbols.length > 0
        ? symbols.map((item) => ({
            exchange: item.exchange,
            qty: item.qty,
            productType: "INTRADAY",
            token: item.token,
            tradeType: item.tradeType,
            orderType: "MARKET",
          }))
        : [
            {
              exchange: formData.exchange,
              qty: formData.quantity || lotSize,
              productType: "INTRADAY",
              token: formData.token,
              tradeType: formData.tradeType,
              orderType: "MARKET",
            },
          ];

    setLoading(true);
    try {
      const res = await fetch("/api/smartapi/margin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positions }),
      });

      // --- check response before parsing ---
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response: ${text}`);
      }

      if (!res.ok) {
        console.error("Margin API failed:", data);
        throw new Error(data.message || data.error || "Unknown error");
      }

      if (data && onResult) onResult(data);
    } catch (err) {
      console.error("Error fetching margin:", err);
      alert(`Error: ${err.message}`); // optional: show user
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box w={{ base: "100%", lg: "70%" }} display="block">
      <Box
        mt={6}
        bg="white"
        boxShadow="lg"
        py={6}
        px={6}
        w="96%"
        mx="2%"
        borderRadius="lg"
      >
        {/* Exchange */}
        <Text mb={1}>Exchange</Text>
        <Select
          options={exchanges}
          value={exchanges.find((opt) => opt.value === formData.exchange)}
          onChange={(val) =>
            setFormData({ ...formData, exchange: val.value, symbol: null })
          }
        />

        {/* Product */}
        <Text mt={4} mb={1}>
          Product
        </Text>
        <Select
          options={products}
          value={products.find((opt) => opt.value === formData.product)}
          onChange={(val) =>
            setFormData({ ...formData, product: val.value, symbol: null })
          }
        />

        {/* Symbol */}
        <SymbolAutocomplete
          symbolData={filteredSymbols}
          value={formData.symbol}
          onChange={handleSymbolChange}
        />

        {/* Options-specific fields */}
        {formData.product === "Options" && (
          <>
            <Text mt={4} mb={1}>
              Option Type
            </Text>
            <Input value={formData.option_type} placeholder="Option Type" disabled />

            <Text mt={4} mb={1}>
              Strike Price
            </Text>
            <Input value={formData.strike_price} placeholder="Strike Price" disabled />
          </>
        )}

        {/* Quantity */}
        <HStack justify="space-between" fontFamily="onest">
          <Text mt={4} mb={1}>
            Quantity
          </Text>
          {lotSize && (
            <Text mt={5} fontSize="xs" color="blue.500">
              Lot Size: {lotSize}
            </Text>
          )}
        </HStack>
        <Input
          fontFamily="onest"
          value={formData.quantity}
          placeholder="Quantity"
          disabled
        />

        {/* Trade Type */}
        <Box my={4} fontFamily="onest">
          <Text mb={1}>Trade Type</Text>
          <Select
            options={tradesType}
            value={tradesType.find((opt) => opt.value === formData.tradeType)}
            onChange={(val) =>
              setFormData({ ...formData, tradeType: val.value })
            }
          />
        </Box>

        {/* Buttons */}
        <HStack gap={6}>
          <Button
            mt={6}
            bg="#fff47c"
            color="black"
            onClick={handleSubmit}
            borderRadius={loading ? "full" : "sm"}
            boxShadow="lg"
          >
            {loading ? <Spinner size="sm" /> : "Submit"}
          </Button>
          <Button
            mt={6}
            onClick={() => {
              if (!formData.symbol) return;
              const data = {
                symbol: formData.symbol?.value,
                exchange: formData.exchange,
                tradeType: formData.tradeType,
                token: formData.token,
                qty: lotSize,
                productType: "INTRADAY",
                orderType: "MARKET",
              };
              setSymbols((prev) => [...prev, data]);
            }}
            bg="#f4f4f4"
            color="black"
          >
            Add Symbol
          </Button>
        </HStack>
      </Box>

      {/* Symbol Table */}
      <Table.Root
        boxShadow="lg"
        w="96%"
        size="sm"
        striped
        variant="outline"
        borderRadius="lg"
        my={6}
        mx="2%"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Symbol</Table.ColumnHeader>
            <Table.ColumnHeader>Exchange</Table.ColumnHeader>
            <Table.ColumnHeader>Quantity</Table.ColumnHeader>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {symbols.map((item, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{item.symbol}</Table.Cell>
              <Table.Cell>{item.exchange}</Table.Cell>
              <Table.Cell>{item.qty}</Table.Cell>
              <Table.Cell>{item.tradeType}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default MarginForm;

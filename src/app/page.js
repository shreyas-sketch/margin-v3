"use client"

import { Box, Button, Center, Image, Spinner, Text } from "@chakra-ui/react"
import { useState } from "react"
import MarginCalculatorTab from "@/components/tabs/MarginCalculatorTab"
// import MarginForm from "@/components/forms/MarginForm"
import FuturesOptionsContent from "@/components/tabs/tabs-content/FutureOptionsContent"
import EquityFuturesContent from "@/components/tabs/tabs-content/EquityFuturesContent"
import CommodityContent from "@/components/tabs/tabs-content/CommodityContent"
import CurrencyContent from "@/components/tabs/tabs-content/CurrencyContent"
import EquityContent from "@/components/tabs/tabs-content/EquityContent"



export default function Home() {
  const [selectedValue, setSelectedValue] = useState("f&o")
  const [loading, setLoading] = useState(false)

  const pageTitles = {
    "f&o": "F&O Margin Calculator",
    "equity_futures": "Equity Futures",
    "commodity": "Commodity",
    "currency": "Currency",
    "equity": "Equity",
  }
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchAndSegmentSymbols'); // works both locally & in prod
      console.log(response)
      if (!response.ok) throw new Error("Failed to update instruments");

      const data = await response.json();
      console.log("Instruments updated:", data);
      // Optionally show toast or update UI
    } catch (error) {
      console.error("Error:", error);
      // Optionally show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="full" h="100vh" justifyItems="center" py="2%" mb={12}>
      <Box w='full' px='5%' py={{base:'2%', lg:'0.5%'}}>
        <Image src='/logo.png' w={{base:'40%', lg:'20%'}} />
      </Box>
      <Text
        fontSize={{ base: "xl", lg: "3xl" }}
        fontFamily="onest"
        fontWeight="semibold"
        letterSpacing="wide"
        color="gray.800"
        mt={6}
        mb={4}
      >
        {pageTitles[selectedValue] ?? "Margin Calculator"}
      </Text>


      <MarginCalculatorTab setSelectedValue={setSelectedValue} />

      <Center mt={6}>
        <Button 
          align='center' bg='#fff47c' color='black' borderRadius='full' size='sm'
          onClick={async () => {
            setLoading(true);
            try {
              const response = await fetch('/.netlify/functions/fetchAndSegmentSymbols'); 
              
              if (!response.ok) throw new Error("Failed to update instruments");

              const data = await response.json();
              console.log("Instruments updated:", data);
            } catch (error) {
              console.error("Error:", error);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          _hover={{ bg: '#fff47c' }}
        >
           {loading ? <Spinner size="sm" color="black" /> : "Update Instruments"}
        </Button>

      </Center>
       {
        selectedValue === "f&o" && <FuturesOptionsContent /> 
       }
       {
        selectedValue === "equity_futures" && <EquityFuturesContent /> 
       }
       {
        selectedValue === "commodity" && <CommodityContent /> 
       }
       {
        selectedValue === "currency" && <CurrencyContent /> 
       }
       {
        selectedValue === "equity" && <EquityContent /> 
       }
    </Box>
  )
}

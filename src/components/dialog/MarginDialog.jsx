"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog, Box,
  Portal,
  VStack,
  HStack,
  Text,
  Button,
  CloseButton,
  Checkbox,
  Spinner,
} from "@chakra-ui/react"

// const MarginDialog = ({ item, open, onOpenChange }) => {
//   const [tradeType, setTradeType] = useState("BUY")
//   const [margin, setMargin] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const handleMarginCall = async () => {
//     try {
//       setLoading(true)
//       const position = {
//         exchange: item.exchange,
//         qty: item.lotsize,
//         productType: "INTRADAY",
//         token: item.token,
//         tradeType: tradeType, // "BUY" or "SELL"
//         orderType: "MARKET",
//       }

//       const resp = await fetch("/api/smartapi/margin", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ position }),
//       })

//       const data = await resp.json()
//       setMargin(data)
//       console.log("Margin response:", data)
//     } catch (err) {
//       console.error("Margin API error:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // 🔑 Auto-fetch margin whenever dialog opens or tradeType changes
//   useEffect(() => {
//     if (open) {
//       handleMarginCall()
//     }
//   }, [open, tradeType])

//   return (
//     <Dialog.Root lazyMount open={open} onOpenChange={onOpenChange}>
//       <Portal>
//         <Dialog.Backdrop />
//         <Dialog.Positioner>
//           <Dialog.Content>
//             <Dialog.Header>
//               <Dialog.Title>{item.symbol}</Dialog.Title>
//             </Dialog.Header>

//             <Dialog.Body display="flex" gap={6}>
//               <VStack align='start' w='30%'>
//                 <VStack align="start" spacing={3}>
//                   <HStack>
//                     <Text fontWeight="bold">Exchange:</Text>
//                     <Text>{item.exch_seg}</Text>
//                   </HStack>
//                   <HStack>
//                     <Text fontWeight="bold">Token:</Text>
//                     <Text>{item.token}</Text>
//                   </HStack>
//                   <HStack>
//                     <Text fontWeight="bold">Name:</Text>
//                     <Text>{item.symbol}</Text>
//                   </HStack>
//                   <HStack>
//                     <Text fontWeight="bold">Quantity (Lot Size):</Text>
//                     <Text>{item.lotsize}</Text>
//                   </HStack>
//                 </VStack>

//                 {/* Buy / Sell Selector */}
//                 <HStack my={5} spacing={6}>
//                   <Checkbox.Root
//                     checked={tradeType === "BUY"}
//                     onCheckedChange={() => setTradeType("BUY")}
//                   >
//                     <Checkbox.HiddenInput />
//                     <Checkbox.Control>
//                       <Checkbox.Indicator />
//                     </Checkbox.Control>
//                     <Checkbox.Label>Buy</Checkbox.Label>
//                   </Checkbox.Root>

//                   <Checkbox.Root
//                     checked={tradeType === "SELL"}
//                     onCheckedChange={() => setTradeType("SELL")}
//                   >
//                     <Checkbox.HiddenInput />
//                     <Checkbox.Control>
//                       <Checkbox.Indicator />
//                     </Checkbox.Control>
//                     <Checkbox.Label>Sell</Checkbox.Label>
//                   </Checkbox.Root>
//                 </HStack>
//               </VStack>

//               <VStack align="end" spacing={3} w='65%'>
//                 <Box p={4} my={1} bg='#fff47c' boxShadow='lg' borderRadius='lg'>
//                   <Text fontWeight='semibold'>
//                     Span:
//                     <Text color='black' mx={4} fontSize='md' as='span' fontWeight='bold'>
//                       Rs. {margin ? margin?.marginComponents?.spanMargin : "--"}
//                     </Text>
//                   </Text>
//                 </Box>
//                 <Box p={4} my={1} bg='#fff47c' boxShadow='lg' borderRadius='lg'>
//                   <Text fontWeight='semibold'>
//                     Exposure Margin:
//                     <Text color='black' mx={4} fontSize='xl' as='span' fontWeight='bold'>
//                       Rs. {margin ? margin?.marginComponents?.exposureMargin : "--"}
//                     </Text>
//                   </Text>
//                 </Box>
//                 <Box p={4} my={1} bg='#fff47c' boxShadow='lg' borderRadius='lg'>
//                   <Text fontWeight='semibold'>
//                     Total Margin:
//                     <Text mx={4} color='black' fontSize='xl' as='span' fontWeight='bold'>
//                       Rs. {margin ? parseFloat(margin?.totalMarginRequired).toFixed(2) : "--"}
//                     </Text>
//                   </Text>
//                 </Box>
//               </VStack>
//             </Dialog.Body>

//             <Dialog.Footer>
//               <Button
//                 variant="outline"
//                 onClick={() => onOpenChange({ open: false })}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 colorScheme={tradeType === "BUY" ? "green" : "red"}
//                 onClick={handleMarginCall}
//               >
//                 {loading ? <Spinner /> : tradeType === "BUY"
//                   ? "Check Buy Margin"
//                   : "Check Sell Margin"}
//               </Button>
//             </Dialog.Footer>

//             <Dialog.CloseTrigger asChild>
//               <CloseButton size="sm" />
//             </Dialog.CloseTrigger>
//           </Dialog.Content>
//         </Dialog.Positioner>
//       </Portal>
//     </Dialog.Root>
//   )
// }

// export default MarginDialog





const MarginDialog = ({ item, open, onOpenChange }) => {
  const [isBuy, setIsBuy] = React.useState(true);
  const [margin, setMargin] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleMarginCall = async () => {
    try {
      setLoading(true);
      setMargin(null); // reset old result
      const positions = {
        exchange: item.exch_seg,
        qty: item.lotsize,
        productType: "INTRADAY",
        token: item.token,
        tradeType: isBuy ? "BUY" : "SELL",
        orderType: "MARKET",
      };
      console.log(positions)

      const resp = await fetch("/api/smartapi/margin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ position }),
        body: JSON.stringify([positions ])
      });
      
      // console.log(await resp.json())

      const data = await resp.json();
      console.log(data)
      setMargin(data); // 🔥 update UI with server response
      console.log("Margin response:", data);
    } catch (err) {
      console.error("Margin API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={onOpenChange} size='lg'>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content h='max-content'>
            <Dialog.Header>
              <Dialog.Title>{item.symbol}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body display='flex' gap={5} justify='space-between'>

              <VStack align='start' w='50%'>
                {/* Info section */}
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Text fontWeight="bold">Exchange:</Text>
                    <Text>{item.exch_seg}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold">Token:</Text>
                    <Text>{item.token}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold">Name:</Text>
                    <Text>{item.symbol}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold">Quantity (Lot Size):</Text>
                    <Text>{item.lotsize}</Text>
                  </HStack>
                </VStack>

                {/* Buy / Sell Selector */}
                <Checkbox.Root
                  my={5}
                  checked={isBuy}
                  onCheckedChange={(e) => setIsBuy(!!e)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label>Buy</Checkbox.Label>
                </Checkbox.Root>

                <Checkbox.Root
                  my={5}
                  checked={!isBuy}
                  onCheckedChange={(e) => setIsBuy(!isBuy)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label>Sell</Checkbox.Label>
                </Checkbox.Root>
              </VStack>

              <Box w='90%'>
              {/* Server response display */}
              {loading && <Text>Loading margin...</Text>}
              {margin && (
                
                <Box 
                  bg='white' boxShadow='lg' 
                  borderRadius='lg' overflow='auto'
                >   
                    <Box w='full' borderTopRadius='lg' h='max-content' p={2} bg='#edf6ff' >
                        <Text letterSpacing={'wide'} fontFamily='poppins' textAlign='center' color='#4185f6'>Combined Margin Requirements</Text>
                    </Box>

                    <Box p={2} w='full' gap={6} fontFamily='onest' mb={12}>
                        <Box w='90%' mx='5%' p={4} my={6} bg='#fff47c' boxShadow='lg' borderRadius='lg' >
                            <Text fontWeight='semibold'>Span: <Text color='black' mx={4} fontSize='xl' as='span' fontWeight='bold'>
                                Rs. {margin ? margin?.marginComponents?.spanMargin : "--"}
                            </Text></Text>
                        </Box>
                        <Box w='90%' mx='5%' p={4} my={6} bg='rgba(255, 244, 124, 1)' boxShadow='lg' borderRadius='lg' >
                            <Text fontWeight='semibold'>Exposure Margin: <Text color='black' mx={4} fontSize='xl' as='span' fontWeight='bold'>
                                Rs. {margin ? margin?.marginComponents?.spanMargin : "--"}
                            </Text></Text>
                        </Box>
                        <Box mb={12} w='90%' mx='5%' p={4} my={6} bg='#fff47c' boxShadow='lg' borderRadius='lg' >
                            <Text fontWeight='semibold'>Total Margin: <Text mx={4} color='black' fontSize='xl' as='span' fontWeight='bold'>
                                Rs. {margin ? parseFloat(margin?.totalMarginRequired)?.toFixed(2) : "--"}
                            </Text></Text>
                        </Box>
                    </Box>

                </Box>
              )}

              </Box>
            </Dialog.Body>

            <Dialog.Footer>
              <Button
                variant="outline"
                onClick={() => onOpenChange({ open: false })}
              >
                Cancel
              </Button>
              <Button
                colorScheme={isBuy ? "green" : "red"}
                onClick={handleMarginCall}
                disabled={loading}
                bg='#fff47c' color='gray.800'
              >
                {isBuy ? "Check Buy Margin" : "Check Sell Margin"}
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MarginDialog;





















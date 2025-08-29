import MarginForm from "@/components/forms/MarginForm"
import AssetsListTable from "@/components/tables/AssetsListTable"
import { Box, HStack, Text,  } from "@chakra-ui/react"
import { useEffect, useState } from "react"



const FuturesOptionsContent = () => {

    const [apiResponse, setApiResponse] = useState(null)
    const [margin, setMargin] = useState(null)

    useEffect(() => {
        if(apiResponse?.data) {
            setMargin(apiResponse.data)
        }
    }, [apiResponse])

    return (
        <Box gap={12} w={{base:'100%', lg: '60%'}}>
            <Box align='start' w={'100%'}  my={6} display={{base:'block', lg:'flex'}}>
                <MarginForm onResult={setApiResponse} />

                <Box w={{base:'96%', lg:'60%'}} mt={6} mx={{base:'2%'}}
                    bg='white' boxShadow='lg' 
                    h='max-content' borderRadius='lg' 
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
                        <Box w='90%' mx='5%' p={4} my={6} bg='#fff47c' boxShadow='lg' borderRadius='lg' >
                            <Text fontWeight='semibold'>Exposure Margin: <Text color='black' mx={4} fontSize='xl' as='span' fontWeight='bold'>
                                Rs. {margin ? margin?.marginComponents?.spanMargin : "--"}
                            </Text></Text>
                        </Box>
                        <Box mb={12} w='90%' mx='5%' p={4} my={6} bg='#fff47c' boxShadow='lg' borderRadius='lg' >
                            <Text fontWeight='semibold'>Total Margin: <Text mx={4} color='black' fontSize='xl' as='span' fontWeight='bold'>
                                Rs. {margin ? parseFloat(margin?.totalMarginRequired).toFixed(2) : "--"}
                            </Text></Text>
                        </Box>
                    </Box>

                </Box>

            </Box>
            <AssetsListTable />
        </Box>
    )
}

export default FuturesOptionsContent 
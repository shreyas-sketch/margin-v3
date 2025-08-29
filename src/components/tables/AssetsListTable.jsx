// import { Table, Button, ButtonGroup, Flex, Text, Box } from "@chakra-ui/react"
// import { useState } from "react"

// const AssetsListTable = ({ data=[] }) => {
//   const [page, setPage] = useState(1)
//   const rowsPerPage = 10

//   const totalPages = Math.ceil(data?.length / rowsPerPage)
//   const startIdx = (page - 1) * rowsPerPage
//   const currentData = data.slice(startIdx, startIdx + rowsPerPage)

//   const handlePrev = () => setPage((p) => Math.max(p - 1, 1))
//   const handleNext = () => setPage((p) => Math.min(p + 1, totalPages))

//   if (!data || data.length === 0) return <Text>No data available.</Text>


//   return (
//     <Box my={12}>
//       <Table.Root size="sm" variant='outline' striped borderRadius='lg' p={4}>
//         <Table.Header bg="teal.500">
//           <Table.Row h='50px' fontFamily='lexend' letterSpacing='wider'>
//             <Table.ColumnHeader color='white'>Contract</Table.ColumnHeader>
//             <Table.ColumnHeader color='white'>NRML Margin</Table.ColumnHeader>
//             <Table.ColumnHeader color='white'>NRML Margin Rate</Table.ColumnHeader>
//             <Table.ColumnHeader color='white'>Price</Table.ColumnHeader>
//             <Table.ColumnHeader color='white' textAlign="end">Action</Table.ColumnHeader>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body px='5%'>
//           {currentData.map((item, index) => (
//             <Table.Row fontFamily='onest' key={index} h='50px' mx='2%' letterSpacing='wider'>
//               <Table.Cell textAlign="start">{item.name}</Table.Cell>
//               <Table.Cell textAlign="center">{item.category}</Table.Cell>
//               <Table.Cell textAlign="center">{item.price}</Table.Cell>
//               <Table.Cell textAlign="center">{item.category}</Table.Cell>
//               <Table.Cell textAlign="end">{item.price}</Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table.Root>

//       {/* Pagination controls */}
//       <Flex justify="space-between" align="center" mt={4}>
//         <Text fontSize="sm">
//           Page {page} of {totalPages}
//         </Text>
//         <ButtonGroup size="sm" isAttached>
//           <Button onClick={handlePrev} isDisabled={page === 1}>
//             Previous
//           </Button>
//           <Button onClick={handleNext} isDisabled={page === totalPages}>
//             Next
//           </Button>
//         </ButtonGroup>
//       </Flex>
//     </Box>
//   )
// }

// export default AssetsListTable





import { Table, Button, ButtonGroup, Flex, Text, Box, Input } from "@chakra-ui/react"
import { useState, useMemo } from "react"
import Fuse from "fuse.js"
import MarginDialog from "../dialog/MarginDialog"



const AssetsListTable = ({ data = [] }) => {
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const rowsPerPage = 10

  // Fuse.js setup
  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys: ["symbol", "expiry"],
      threshold: 0.3,
    })
  }, [data])

  const filteredData = useMemo(() => {
    if (!search) return data
    return fuse.search(search).map((r) => r.item)
  }, [search, fuse])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const startIdx = (page - 1) * rowsPerPage
  const currentData = filteredData.slice(startIdx, startIdx + rowsPerPage)

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1))
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages))

  if (!data || data.length === 0) return <Text></Text>

  return (
    <Box my={12}>
      {/* Search Input */}
      <Input
        mb={6} borderRadius='full' px={6}
        placeholder="Search by name or symbol"
        value={search} fontFamily='onest'
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1) // Reset to first page on new search
        }}
        _focus={{
            outline:'none',
            // border: 'none'
        }}
      />

      <Table.Root size="sm" variant="outline" striped borderRadius="lg" p={4}>
        <Table.Header bg="#fff47c">
          <Table.Row h="50px" fontFamily="lexend" letterSpacing="wider">
            <Table.ColumnHeader color="black">Token</Table.ColumnHeader>
            <Table.ColumnHeader color="black">Contract</Table.ColumnHeader>
            <Table.ColumnHeader color="black" textAlign={'center'}>Name</Table.ColumnHeader>
            <Table.ColumnHeader color="black" textAlign="center">
              Action
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentData.map((item, index) => (
            <Table.Row key={index} fontFamily="onest" h="50px" letterSpacing="wider">
              
              <Table.Cell>{item.token}</Table.Cell>
              <Table.Cell>{item.symbol}</Table.Cell>
              <Table.Cell textAlign="center">{item.name}</Table.Cell>
              <Table.Cell textAlign="center">
                <Button 
                    size='sm' borderRadius='full' w='80px'
                    fontSize='xs' letterSpacing='wide'
                    bg='#fff47c' onClick={() => setOpen(true)}
                    color='black'
                >
                    Calculate
                </Button>
                <MarginDialog item={item} open={open} onOpenChange={(e) => setOpen(e.open)} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
      <Flex justify="space-between" align="center" mt={4}>
        <Text fontSize="sm">
          Page {page} of {totalPages}
        </Text>
        <ButtonGroup size="sm" isAttached>
          <Button bg='#fff47c' color='blackAlpha.800' onClick={handlePrev} isDisabled={page === 1}>
            Previous
          </Button>
          <Button bg='#fff47c' color='blackAlpha.800' onClick={handleNext} isDisabled={page === totalPages}>
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  )
}

export default AssetsListTable

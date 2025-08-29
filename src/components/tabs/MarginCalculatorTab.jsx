import { Icon, Tabs } from "@chakra-ui/react"

import {BsGraphUpArrow} from "react-icons/bs"
import {MdCurrencyExchange, MdShowChart} from "react-icons/md"
import {AiFillGold} from "react-icons/ai"
import {TbArrowsExchange} from "react-icons/tb"



const MarginCalculatorTab = ({setSelectedValue}) => {
  return (
        <Tabs.Root 
            borderRadius='lg' p={1} minW='800px' fitted  
            bg='#f4f4f4' defaultValue="f&o" variant={"enclosed"} 
            fontFamily='onest'
            onValueChange={(val) => {
                setSelectedValue(val.value)
            }}
        >
            <Tabs.List bg='none'>
                <Tabs.Trigger value="f&o"  fontSize='md' color='#c0ad52'>
                <Icon as={TbArrowsExchange} boxSize={5} />
                F&O
                </Tabs.Trigger>
                <Tabs.Trigger value="equity_futures"  fontSize='md' color='#c0ad52' w='400px'>
                <Icon as={BsGraphUpArrow} boxSize={4} />
                Equity Futures
                </Tabs.Trigger>
                <Tabs.Trigger value="commodity" fontSize='md' color='#c0ad52'>
                <Icon as={AiFillGold} boxSize={5} />
                Commodity
                </Tabs.Trigger>
                <Tabs.Trigger value="currency" fontSize='md' color='#c0ad52'>
                <Icon as={MdCurrencyExchange} boxSize={4} />
                Currency
                </Tabs.Trigger>
                <Tabs.Trigger value="equity" fontSize='md' color='#c0ad52'>
                <Icon as={MdShowChart} boxSize={5} />
                Equity
                </Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
  )
}


export default MarginCalculatorTab




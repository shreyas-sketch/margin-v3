'use client'

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { FiMenu, FiX } from 'react-icons/fi'

import { useColorModeValue } from './ui/color-mode'


const Links = ['Dashboard', 'Projects', 'Team']

const NavLink = ({ children }) => {
    const navBg = useColorModeValue("gray.200", "gray.700")
    return (
        <Box
            as="a"
            px={3}
            py={2}
            rounded="md"
            fontWeight="medium"
            _hover={{
            textDecoration: 'none',
            bg: navBg,
            }}
            href="#"
        >
            {children}
        </Box>

    )
}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box w='full' bg={useColorModeValue('gray.100', 'gray.900')} px={4} boxShadow="sm" position='absolute' top={0} zIndex={999}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold">Logo</Box>

        <IconButton
          size="md"
          icon={isOpen ? <FiX /> : <FiMenu />}
          aria-label="Toggle Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          variant="ghost"
        />

        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          {Links.map((link) => (
            <NavLink key={link}>{link}</NavLink>
          ))}
        </HStack>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={2}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}

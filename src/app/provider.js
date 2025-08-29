'use client';

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        title: {
          value: '#111827',
        },
        dark: {
          a0: { value: '#000000' },
        },
        light: {
          a0: { value: '#ffffff' },
        },
        primary: {
          a0: { value: '#55e653' },
          a10: { value: '#70e968' },
          a20: { value: '#86ed7c' },
          a30: { value: '#9af08f' },
          a40: { value: '#adf3a2' },
          a50: { value: '#bef6b5' },
        },
        surface: {
          a0: { value: '#080101' },
          a5: { value: "#1a1a1a" },
          a10: { value: '#221e1e' },
          a20: { value: '#393636' },
          a30: { value: '#524f4f' },
          a40: { value: '#6c6969' },
          a50: { value: '#888585' },
        },
        surfaceTonal: {
          a0: { value: '#161b0f' },
          a10: { value: '#2b3025' },
          a20: { value: '#42463c' },
          a30: { value: '#5a5e55' },
          a40: { value: '#73776f' },
          a50: { value: '#8d908a' },
        },
      },
      fonts: {
        body: { value: 'var(--font-geist-sans)' },
        heading: { value: 'var(--font-geist-sans)' },
        mono: { value: 'var(--font-geist-mono)' },
      },
      fontSizes: {
        xs: { value: '0.75rem' },
        sm: { value: '0.875rem' },
        md: { value: '1rem' },
        lg: { value: '1.125rem' },
        xl: { value: '1.25rem' },
        '2xl': { value: '1.5rem' },
        '3xl': { value: '1.875rem' },
        '4xl': { value: '2.25rem' },
        '5xl': { value: '3rem' },
        '6xl': { value: '3.75rem' },
        '7xl': { value: '4.5rem' },
        '8xl': { value: '6rem' },
        '9xl': { value: '8rem' },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export const Provider = ({ children }) => {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
};
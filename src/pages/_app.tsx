import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

// Custom theme for SafeMap
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
    emergency: {
      50: '#fed7d7',
      100: '#feb2b2',
      200: '#fc8181',
      300: '#f56565',
      400: '#e53e3e',
      500: '#c53030',
      600: '#9b2c2c',
      700: '#742a2a',
      800: '#63171b',
      900: '#1a202c',
    }
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'purple',
      },
      variants: {
        emergency: {
          bg: 'red.500',
          color: 'white',
          _hover: {
            bg: 'red.600',
            transform: 'scale(1.05)',
          },
          _active: {
            bg: 'red.700',
            transform: 'scale(0.95)',
          },
        },
      },
    },
  },
});

function SafeMapApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default SafeMapApp; 
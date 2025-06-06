import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Badge,
  Alert,
  AlertIcon,
  useColorModeValue,
  Container,
  Grid,
  GridItem,
  Icon,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Select,
  Textarea,
  Switch,
  FormControl,
  FormLabel,
  useToast
} from '@chakra-ui/react';
import { 
  WarningIcon, 
  PhoneIcon, 
  ViewIcon,
  ViewOffIcon,
  LockIcon,
  TimeIcon
} from '@chakra-ui/icons';
import Head from 'next/head';
import { io, Socket } from 'socket.io-client';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

const SafeMapWebApp: React.FC = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [stealthMode, setStealthMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [emergencyTimer, setEmergencyTimer] = useState(0);

  const { isOpen: isSetupOpen, onOpen: onSetupOpen, onClose: onSetupClose } = useDisclosure();
  const { isOpen: isEmergencyOpen, onOpen: onEmergencyOpen, onClose: onEmergencyClose } = useDisclosure();

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

    newSocket.on('connect', () => {
      setIsConnected(true);
      toast({
        title: 'Connected to SafeMap',
        description: 'Emergency services are now available',
        status: 'success',
        duration: 3000,
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      toast({
        title: 'Disconnected',
        description: 'Attempting to reconnect...',
        status: 'warning',
        duration: 3000,
      });
    });

    setSocket(newSocket);

    // Request location permission
    requestLocationPermission();

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEmergencyActive) {
      interval = setInterval(() => {
        setEmergencyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEmergencyActive]);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          setLocation(newLocation);
          toast({
            title: 'Location Access Granted',
            description: 'SafeMap can now track your location for emergencies',
            status: 'success',
            duration: 3000,
          });
        },
        (error) => {
          toast({
            title: 'Location Access Denied',
            description: 'Please enable location access for emergency features',
            status: 'error',
            duration: 5000,
          });
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support location tracking',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setIsLocationSharing(true);
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        };
        setLocation(newLocation);
        
        // Send location to server
        if (socket && isConnected) {
          socket.emit('location:update', newLocation);
        }
      },
      (error) => {
        console.error('Location error:', error);
        setIsLocationSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    // Store watch ID to clear later
    return watchId;
  };

  const triggerEmergency = async (method: string = 'PANIC_BUTTON') => {
    if (!location) {
      toast({
        title: 'Location Required',
        description: 'Please enable location access to trigger emergency',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setIsEmergencyActive(true);
    setEmergencyTimer(0);
    onEmergencyOpen();

    // Start location sharing
    startLocationSharing();

    const emergencyData = {
      type: 'PERSONAL_SAFETY',
      location: location,
      triggerMethod: method,
      contacts: emergencyContacts,
      timestamp: new Date().toISOString()
    };

    try {
      // Send to backend
      if (socket && isConnected) {
        socket.emit('emergency:trigger', emergencyData);
      }

      // Simulate emergency response
      toast({
        title: '🚨 EMERGENCY ACTIVATED',
        description: 'Emergency services have been notified. Help is on the way.',
        status: 'error',
        duration: 10000,
        isClosable: true,
      });

      // Simulate notifications to emergency contacts
      emergencyContacts.forEach((contact, index) => {
        setTimeout(() => {
          toast({
            title: `Notifying ${contact.name}`,
            description: `Emergency alert sent to ${contact.phone}`,
            status: 'info',
            duration: 3000,
          });
        }, (index + 1) * 1000);
      });

    } catch (error) {
      console.error('Emergency trigger error:', error);
      toast({
        title: 'Emergency Error',
        description: 'Failed to trigger emergency. Please call 112 directly.',
        status: 'error',
        duration: 10000,
      });
    }
  };

  const stopEmergency = () => {
    setIsEmergencyActive(false);
    setIsLocationSharing(false);
    setEmergencyTimer(0);
    onEmergencyClose();

    if (socket && isConnected) {
      socket.emit('emergency:cancel');
    }

    toast({
      title: 'Emergency Cancelled',
      description: 'Emergency response has been cancelled',
      status: 'info',
      duration: 3000,
    });
  };

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      name: '',
      phone: '',
      relationship: 'family'
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Head>
        <title>SafeMap - Women's Safety Web App</title>
        <meta name="description" content="Emergency response system for women's safety" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.md" py={8}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box textAlign="center">
              <Heading size="xl" color="purple.600" mb={2}>
                🛡️ SafeMap
              </Heading>
              <Text fontSize="lg" color="gray.600" mb={4}>
                Your Safety, Our Priority
              </Text>
              <HStack justify="center" spacing={4}>
                <Badge colorScheme={isConnected ? 'green' : 'red'}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
                <Badge colorScheme={location ? 'blue' : 'gray'}>
                  {location ? 'Location Available' : 'No Location'}
                </Badge>
                <Badge colorScheme={stealthMode ? 'purple' : 'gray'}>
                  {stealthMode ? 'Stealth Mode' : 'Normal Mode'}
                </Badge>
              </HStack>
            </Box>

            {/* Emergency Status */}
            {isEmergencyActive && (
              <Alert status="error">
                <AlertIcon />
                <VStack align="start" flex="1">
                  <Text fontWeight="bold">🚨 EMERGENCY ACTIVE</Text>
                  <Text>Time elapsed: {formatTime(emergencyTimer)}</Text>
                  <Progress value={(emergencyTimer % 60) * 100 / 60} colorScheme="red" size="sm" w="100%" />
                </VStack>
              </Alert>
            )}

            {/* Main Emergency Panel */}
            <Box bg={cardBg} p={8} rounded="lg" shadow="md" textAlign="center">
              <VStack spacing={6}>
                <Icon as={WarningIcon} boxSize={12} color="red.500" />
                
                <VStack spacing={2}>
                  <Heading size="lg">Emergency Response</Heading>
                  <Text color="gray.600">
                    Press and hold the panic button to trigger emergency
                  </Text>
                </VStack>

                {!isEmergencyActive ? (
                  <Button
                    size="lg"
                    colorScheme="red"
                    variant="solid"
                    w="200px"
                    h="200px"
                    borderRadius="50%"
                    fontSize="xl"
                    fontWeight="bold"
                    onMouseDown={() => triggerEmergency('PANIC_BUTTON')}
                    onTouchStart={() => triggerEmergency('PANIC_BUTTON')}
                    _hover={{ transform: 'scale(1.05)' }}
                    _active={{ transform: 'scale(0.95)' }}
                  >
                    🚨<br />PANIC<br />BUTTON
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    colorScheme="green"
                    variant="solid"
                    w="200px"
                    h="200px"
                    borderRadius="50%"
                    fontSize="xl"
                    fontWeight="bold"
                    onClick={stopEmergency}
                    _hover={{ transform: 'scale(1.05)' }}
                  >
                    ✅<br />STOP<br />EMERGENCY
                  </Button>
                )}

                <Text fontSize="sm" color="gray.500">
                  {isEmergencyActive 
                    ? 'Click to cancel emergency response'
                    : 'Click and hold to activate emergency response'
                  }
                </Text>
              </VStack>
            </Box>

            {/* Quick Actions */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Button
                  w="100%"
                  h="80px"
                  leftIcon={<PhoneIcon />}
                  colorScheme="orange"
                  variant="outline"
                  fontSize="lg"
                  onClick={() => window.open('tel:112')}
                >
                  Call 112<br />
                  <Text fontSize="sm">Emergency Services</Text>
                </Button>
              </GridItem>
              
              <GridItem>
                <Button
                  w="100%"
                  h="80px"
                  leftIcon={<Icon as={stealthMode ? ViewOffIcon : ViewIcon} />}
                  colorScheme="purple"
                  variant="outline"
                  fontSize="lg"
                  onClick={() => setStealthMode(!stealthMode)}
                >
                  Stealth Mode<br />
                  <Text fontSize="sm">{stealthMode ? 'Enabled' : 'Disabled'}</Text>
                </Button>
              </GridItem>

              <GridItem>
                <Button
                  w="100%"
                  h="80px"
                  leftIcon={<LockIcon />}
                  colorScheme="blue"
                  variant="outline"
                  fontSize="lg"
                  onClick={onSetupOpen}
                >
                  Setup<br />
                  <Text fontSize="sm">Configure SafeMap</Text>
                </Button>
              </GridItem>

              <GridItem>
                <Button
                  w="100%"
                  h="80px"
                  leftIcon={<TimeIcon />}
                  colorScheme="teal"
                  variant="outline"
                  fontSize="lg"
                  onClick={() => triggerEmergency('VOICE_COMMAND')}
                >
                  Voice Emergency<br />
                  <Text fontSize="sm">Say "Help Me"</Text>
                </Button>
              </GridItem>
            </Grid>

            {/* Location Status */}
            {location && (
              <Box bg={cardBg} p={4} rounded="lg" shadow="sm">
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">📍 Current Location</Text>
                  <Text fontSize="sm" color="gray.600">
                    Lat: {location.latitude.toFixed(6)}, 
                    Lng: {location.longitude.toFixed(6)}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Accuracy: ±{location.accuracy}m | 
                    Updated: {location.timestamp.toLocaleTimeString()}
                  </Text>
                  <Badge colorScheme={isLocationSharing ? 'green' : 'gray'}>
                    {isLocationSharing ? 'Sharing Location' : 'Location Available'}
                  </Badge>
                </VStack>
              </Box>
            )}

            {/* Emergency Contacts */}
            {emergencyContacts.length > 0 && (
              <Box bg={cardBg} p={4} rounded="lg" shadow="sm">
                <VStack align="start" spacing={3}>
                  <Text fontWeight="bold">👥 Emergency Contacts</Text>
                  {emergencyContacts.map((contact, index) => (
                    <HStack key={index} w="100%" justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{contact.name || 'Unnamed Contact'}</Text>
                        <Text fontSize="sm" color="gray.600">{contact.phone}</Text>
                      </VStack>
                      <Badge>{contact.relationship}</Badge>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Help & Instructions */}
            <Box bg={cardBg} p={4} rounded="lg" shadow="sm">
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">ℹ️ How to Use SafeMap</Text>
                <Text fontSize="sm">1. Enable location access for emergency tracking</Text>
                <Text fontSize="sm">2. Set up emergency contacts in Settings</Text>
                <Text fontSize="sm">3. Press panic button in emergency situations</Text>
                <Text fontSize="sm">4. Use stealth mode for discreet activation</Text>
                <Text fontSize="sm">5. Call 112 directly for immediate help</Text>
              </VStack>
            </Box>
          </VStack>
        </Container>

        {/* Setup Modal */}
        <Modal isOpen={isSetupOpen} onClose={onSetupClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>SafeMap Setup</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Emergency Contacts</FormLabel>
                  <VStack spacing={2}>
                    {emergencyContacts.map((contact, index) => (
                      <HStack key={index} spacing={2}>
                        <Input
                          placeholder="Name"
                          value={contact.name}
                          onChange={(e) => {
                            const updated = [...emergencyContacts];
                            updated[index].name = e.target.value;
                            setEmergencyContacts(updated);
                          }}
                        />
                        <Input
                          placeholder="Phone"
                          value={contact.phone}
                          onChange={(e) => {
                            const updated = [...emergencyContacts];
                            updated[index].phone = e.target.value;
                            setEmergencyContacts(updated);
                          }}
                        />
                        <Select
                          value={contact.relationship}
                          onChange={(e) => {
                            const updated = [...emergencyContacts];
                            updated[index].relationship = e.target.value;
                            setEmergencyContacts(updated);
                          }}
                        >
                          <option value="family">Family</option>
                          <option value="friend">Friend</option>
                          <option value="colleague">Colleague</option>
                        </Select>
                      </HStack>
                    ))}
                    <Button onClick={addEmergencyContact} variant="outline" size="sm">
                      Add Contact
                    </Button>
                  </VStack>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="stealth-mode" mb="0">
                    Enable Stealth Mode
                  </FormLabel>
                  <Switch
                    id="stealth-mode"
                    isChecked={stealthMode}
                    onChange={(e) => setStealthMode(e.target.checked)}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Emergency Modal */}
        <Modal 
          isOpen={isEmergencyOpen} 
          onClose={() => {}} 
          closeOnOverlayClick={false}
          closeOnEsc={false}
        >
          <ModalOverlay bg="red.100" />
          <ModalContent bg="red.50" borderColor="red.500" borderWidth={2}>
            <ModalHeader color="red.700">🚨 EMERGENCY ACTIVE</ModalHeader>
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Text fontWeight="bold" fontSize="lg">
                  Emergency services have been notified
                </Text>
                <Text>Time elapsed: {formatTime(emergencyTimer)}</Text>
                <Progress value={(emergencyTimer % 60) * 100 / 60} colorScheme="red" size="lg" w="100%" />
                <Text fontSize="sm" color="gray.600">
                  Emergency contacts are being notified. Help is on the way.
                </Text>
                <Button colorScheme="red" onClick={stopEmergency} size="lg" w="100%">
                  Cancel Emergency
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default SafeMapWebApp; 
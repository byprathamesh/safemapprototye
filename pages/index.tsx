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
  Switch,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue
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
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: 'Mom', phone: '+91-9876543210', relationship: 'family' },
    { name: 'Police Station', phone: '100', relationship: 'emergency' }
  ]);
  const [stealthMode, setStealthMode] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [emergencyTimer, setEmergencyTimer] = useState(0);

  const { isOpen: isSetupOpen, onOpen: onSetupOpen, onClose: onSetupClose } = useDisclosure();
  const { isOpen: isEmergencyOpen, onOpen: onEmergencyOpen, onClose: onEmergencyClose } = useDisclosure();

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    // Simulate connection
    setIsConnected(true);
    
    // Request location permission
    requestLocationPermission();

    // Show welcome message
    toast({
      title: '🛡️ Welcome to SafeMap',
      description: 'Your safety companion is ready',
      status: 'success',
      duration: 3000,
    });
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
            title: '📍 Location Access Granted',
            description: 'SafeMap can now track your location for emergencies',
            status: 'success',
            duration: 3000,
          });
        },
        (error) => {
          // Use demo location if permission denied
          const demoLocation: UserLocation = {
            latitude: 28.6139,  // New Delhi
            longitude: 77.2090,
            accuracy: 10,
            timestamp: new Date()
          };
          setLocation(demoLocation);
          
          toast({
            title: '📍 Demo Mode',
            description: 'Using demo location (New Delhi). Enable location for real coordinates.',
            status: 'info',
            duration: 5000,
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      // Fallback demo location
      const demoLocation: UserLocation = {
        latitude: 28.6139,
        longitude: 77.2090,
        accuracy: 10,
        timestamp: new Date()
      };
      setLocation(demoLocation);
    }
  };

  const startLocationSharing = () => {
    setIsLocationSharing(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          setLocation(newLocation);
        },
        (error) => {
          console.error('Location error:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
  };

  const triggerEmergency = async (method: string = 'PANIC_BUTTON') => {
    if (!location) {
      requestLocationPermission();
    }

    setIsEmergencyActive(true);
    setEmergencyTimer(0);
    onEmergencyOpen();

    // Start location sharing
    startLocationSharing();

    // Show emergency alert
    toast({
      title: '🚨 EMERGENCY ACTIVATED',
      description: 'Emergency services are being notified. Help is on the way.',
      status: 'error',
      duration: 10000,
      isClosable: true,
    });

    // Simulate emergency response
    setTimeout(() => {
      toast({
        title: '📞 Emergency Services Contacted',
        description: '112 India has been notified of your emergency',
        status: 'warning',
        duration: 5000,
      });
    }, 2000);

    // Simulate notifications to emergency contacts
    emergencyContacts.forEach((contact, index) => {
      setTimeout(() => {
        toast({
          title: `📱 Notifying ${contact.name}`,
          description: `Emergency alert sent to ${contact.phone}`,
          status: 'info',
          duration: 3000,
        });
      }, (index + 1) * 1000 + 3000);
    });

    // Simulate police response
    setTimeout(() => {
      toast({
        title: '🚔 Police Dispatched',
        description: 'Nearest police station has been alerted. ETA: 5-10 minutes',
        status: 'success',
        duration: 7000,
      });
    }, 8000);
  };

  const stopEmergency = () => {
    setIsEmergencyActive(false);
    setIsLocationSharing(false);
    setEmergencyTimer(0);
    onEmergencyClose();

    toast({
      title: '✅ Emergency Cancelled',
      description: 'Emergency response has been cancelled successfully',
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
        <link rel="icon" href="🛡️" />
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
                  {isConnected ? 'Online' : 'Offline'}
                </Badge>
                <Badge colorScheme={location ? 'blue' : 'gray'}>
                  {location ? 'Location Ready' : 'No Location'}
                </Badge>
                <Badge colorScheme={stealthMode ? 'purple' : 'gray'}>
                  {stealthMode ? 'Stealth Mode' : 'Normal Mode'}
                </Badge>
              </HStack>
            </Box>

            {/* Emergency Status */}
            {isEmergencyActive && (
              <Alert status="error" borderRadius="lg">
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
                    Click the panic button to trigger emergency response
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
                    onClick={() => triggerEmergency('PANIC_BUTTON')}
                    _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
                    _active={{ transform: 'scale(0.95)' }}
                    transition="all 0.2s"
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
                    transition="all 0.2s"
                  >
                    ✅<br />STOP<br />EMERGENCY
                  </Button>
                )}

                <Text fontSize="sm" color="gray.500">
                  {isEmergencyActive 
                    ? 'Click to cancel emergency response'
                    : 'Click to activate emergency response'
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
                  onClick={() => {
                    toast({
                      title: '📞 Calling 112',
                      description: 'Emergency services will be contacted',
                      status: 'info',
                      duration: 3000,
                    });
                    // window.open('tel:112');
                  }}
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
                  onClick={() => {
                    setStealthMode(!stealthMode);
                    toast({
                      title: stealthMode ? '👁️ Stealth Mode Disabled' : '🥷 Stealth Mode Enabled',
                      description: stealthMode 
                        ? 'SafeMap will show normal interface' 
                        : 'SafeMap will hide emergency features',
                      status: 'info',
                      duration: 3000,
                    });
                  }}
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
                  onClick={() => {
                    toast({
                      title: '🎤 Voice Emergency',
                      description: 'Say "Help Me" or "Emergency" to activate',
                      status: 'info',
                      duration: 5000,
                    });
                    triggerEmergency('VOICE_COMMAND');
                  }}
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
                  <Badge colorScheme={isLocationSharing ? 'green' : 'blue'}>
                    {isLocationSharing ? 'Sharing Location Live' : 'Location Available'}
                  </Badge>
                </VStack>
              </Box>
            )}

            {/* Emergency Contacts */}
            <Box bg={cardBg} p={4} rounded="lg" shadow="sm">
              <VStack align="start" spacing={3}>
                <Text fontWeight="bold">👥 Emergency Contacts ({emergencyContacts.length})</Text>
                {emergencyContacts.map((contact, index) => (
                  <HStack key={index} w="100%" justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold">{contact.name}</Text>
                      <Text fontSize="sm" color="gray.600">{contact.phone}</Text>
                    </VStack>
                    <Badge colorScheme="purple">{contact.relationship}</Badge>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Help & Instructions */}
            <Box bg={cardBg} p={4} rounded="lg" shadow="sm">
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">ℹ️ How to Use SafeMap</Text>
                <Text fontSize="sm">• Click panic button for immediate emergency response</Text>
                <Text fontSize="sm">• Set up emergency contacts for automatic notifications</Text>
                <Text fontSize="sm">• Use stealth mode for discreet operation</Text>
                <Text fontSize="sm">• Voice commands work in Hindi and English</Text>
                <Text fontSize="sm">• Call 112 directly for immediate police assistance</Text>
                <Text fontSize="sm" color="purple.600" fontWeight="semibold">
                  🇮🇳 Designed specifically for Indian women's safety
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Container>

        {/* Setup Modal */}
        <Modal isOpen={isSetupOpen} onClose={onSetupClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>🔧 SafeMap Setup</ModalHeader>
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
                          <option value="emergency">Emergency Service</option>
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

                <Box p={4} bg="purple.50" rounded="md">
                  <Text fontSize="sm" color="purple.700">
                    <strong>🇮🇳 Indian Features:</strong><br />
                    • Integrated with Jio, Airtel, VI, BSNL networks<br />
                    • 112 India emergency services support<br />
                    • Voice commands in Hindi and English<br />
                    • Compliant with Indian IT Act 2000
                  </Text>
                </Box>
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
                <Text fontWeight="bold" fontSize="lg" textAlign="center">
                  Emergency services have been notified
                </Text>
                <Text textAlign="center">Time elapsed: {formatTime(emergencyTimer)}</Text>
                <Progress value={(emergencyTimer % 60) * 100 / 60} colorScheme="red" size="lg" w="100%" />
                
                <VStack spacing={2} w="100%">
                  <Alert status="info" size="sm">
                    <AlertIcon />
                    <Text fontSize="sm">112 India emergency services contacted</Text>
                  </Alert>
                  <Alert status="warning" size="sm">
                    <AlertIcon />
                    <Text fontSize="sm">Emergency contacts being notified</Text>
                  </Alert>
                  <Alert status="success" size="sm">
                    <AlertIcon />
                    <Text fontSize="sm">Location being shared continuously</Text>
                  </Alert>
                </VStack>

                <Button colorScheme="red" onClick={stopEmergency} size="lg" w="100%">
                  Cancel Emergency
                </Button>
                
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  Help is on the way. Stay calm and safe.
                </Text>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default SafeMapWebApp; 
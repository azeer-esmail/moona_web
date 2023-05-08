import React, { useEffect, useState } from 'react';
import { Box, Container, Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack, HStack } from "@chakra-ui/layout";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import { Center, Square, Circle } from '@chakra-ui/react'

const ENDPOINT = "http://127.0.0.1:5000";
var socket;

const ControlPage = () => {
  const toast = useToast();
  const history = useHistory();
  const [command, setCommand] = useState("");
  const [socket, setSocket] = useState();
  const [plcResponse, setPlcResponse] = useState("");
  const [greenOn, setGreenOn] = useState(false);
  const [redOn, setRedOn] = useState(false);

  const user = JSON.parse(localStorage.getItem("userInfo")) || {};
  const getAccess = async () => {
    try {
      
      const config = {
        headers: {
          Authorization: user.token ? `Bearer ${user.token}`: null,
        },
      };

      const { data } = await axios.get(
        "/api/controls/access",
        config
      );
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    localStorage.removeItem("userInfo")
    history.push("/");
  };

  useEffect(() => {
    getAccess();
  }, [])


  useEffect(() => {
    const sock = io(ENDPOINT);
    setSocket(sock)
    sock.emit("setup", user);
    sock.on("plcRes", (plcRes) => {
      setPlcResponse(plcRes)
      console.log(plcRes)
      if (plcRes == "green is on") { setGreenOn(true) }
      if (plcRes == "green is off") { setGreenOn(false) }
      if (plcRes == "red is on") { setRedOn(true) }
      if (plcRes == "red is off") { setRedOn(false) }
    })
    // eslint-disable-next-line
  }, []);

  const handleClick = () => {
    socket.emit("webCMD", command);
  }

  return (
    <Container maxW="xl" centerContent opacity="0.95">
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" textAlign="center">
          Project Remote Control
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <VStack spacing="10px">
          <FormControl id="email" isRequired>
            <FormLabel>PLC Command Line</FormLabel>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command"
            />
          </FormControl>
          <Button h="1.75rem" size="sm" onClick={handleClick}>Send</Button>
          <Text fontSize="xl" fontFamily="Work sans" textAlign="center">
            {plcResponse}
          </Text>
          <HStack>
            <Circle
              size='40px'
              bg={greenOn ? "green" : "gray"}
              color='black'
              onClick={() => socket.emit("webCMD", (greenOn ? "green off": "green on"))} 
            />
            <Circle
              size='40px'
              bg={redOn ? "red" : "gray"}
              color='black'
              onClick={() => socket.emit("webCMD", (redOn ? "red off": "red on"))} 
            />
          </HStack>
        </VStack>
      </Box>
    </Container>


  )
}

export default ControlPage
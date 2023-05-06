import React, { useEffect } from 'react';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000";
var socket;

const ControlPage = () => {
  const toast = useToast();
  const history = useHistory();
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
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", (data) => {console.log(data)});

    // eslint-disable-next-line
  }, []);

  return (
    <div>ControlPage</div>
  )
}

export default ControlPage
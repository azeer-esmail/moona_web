import React, { useEffect } from 'react';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const ControlPage = () => {
  const toast = useToast();
  const history = useHistory();

  const getAccess = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo")) || {};
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




  return (
    <div>ControlPage</div>
  )
}

export default ControlPage
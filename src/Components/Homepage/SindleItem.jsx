import { Box, Button, Heading, Image, Text } from "@chakra-ui/react";
// import { isDisabled } from "@testing-library/user-event/dist/utils";
import React from "react";
import { useState } from "react";

export const SindleItem = ({ data,heading,handleCart }) => {

const [clic,setCli] = useState(0)

// ensure cartData is always an array
let cartData = JSON.parse(localStorage.getItem("cxcart")) || []

 const handleClick =(el) =>{
   const isItemInCart = cartData.some(item => item.name === el.name);
   handleCart(el, isItemInCart);
   setCli(isItemInCart ? 0 : prev => prev + 1);
 }
// console.log(clic)
  return (
    <Box >
      <Box p="50px">
        <Heading fontSize={"50px"}>{heading}</Heading>
      </Box>

      <Box
        //    border={"1px solid red"}
        display="grid"
        gridTemplateColumns={{
          base: "repeat(1,1fr)",
          sm: "repeat(1,1fr)",
          md: "repeat(2,1fr)",
          lg: "repeat(3,1fr)",
          xl: "repeat(3,1fr)",
          "2xl": "repeat(4,1fr)",
        }}
        gap="20px"
      >
        {data?.map((el, ind) => {
          return (
            <Box display={"flex"} alignItems="center" justifyContent={"space-between"} key={ind} shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px" >
              <Box w="40%"  >
                <Image   src={el.img} />
              </Box>

              <Box
                // mt="10px"
                w="60%"
                display={"flex"}
                flexDirection="column"
                justifyContent="space-between"
                alignItems={"center"}
              >
                <Text fontWeight={"600"} fontSize="23px">
                  {el.name}
                </Text>
                <Text fontWeight={"500"}>{el.qty}</Text>
                <Text color="#3182ce" fontWeight={"900"} fontSize="18px">
                   Rs{el.price}-/ 
                </Text>
                <Button
                  mt="5px"
                  mb="5px"
                  w="100px"
                  border={"1px solid black"}
                  bg={cartData.some((item) => item.name === el.name) ? "#ff4d4d" : "white"}
                  color={cartData.some((item) => item.name === el.name) ? "white" : "black"}
                  _hover={{
                    bg: cartData.some((item) => item.name === el.name) ? "#ff3333" : "#3182ce",
                    color: "white",
                    border: "1px solid white",
                  }}
                  onClick={()=>{handleClick(el)}}
                >
                  {cartData.some((item) => item.name === el.name) ? "Remove" : "Add to cart"}
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

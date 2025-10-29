import { Box, Button, Heading, HStack, Stack, Text,  } from "@chakra-ui/react";
import React, { useEffect } from "react";
// import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Redux/action";
import { SindleItem } from "./SindleItem";

export const Menu = React.memo(({ mainveg, rot, setCart }) => {
 
    let cartData = JSON.parse(localStorage.getItem("cxcart")) || []

    const handleCart = (item, isRemoving = false) =>{
        if (isRemoving) {
            cartData = cartData.filter(cartItem => cartItem.name !== item.name);
        } else {
            item.count = 1;
            cartData.push(item);
        }
    
        localStorage.setItem("cxcart",JSON.stringify(cartData))
        setCart(JSON.parse(localStorage.getItem("cxcart")))
        try{
          window.dispatchEvent(new CustomEvent('cartUpdated',{detail: JSON.parse(localStorage.getItem('cxcart'))}))
        }catch(e){ }
      }

  const dispatch = useDispatch()

  const food = useSelector(store=>store.foodData)

// console.log(food.briyani)

  useEffect(()=>{
   
        dispatch(getData())
    
      
    },[])

    // console.log(food)
    
   

    const handleMainV =()=>{
        mainveg?.current?.scrollIntoView({behavior: 'smooth'})
    }
    const handleRot =()=>{
        rot?.current?.scrollIntoView({behavior: 'smooth'})
    }


  return (
    <Box>
      <Box
        //  border={"1px solid red"}
        padding={{
          base: "35px",
          sm: "35px",
          md: "40px",
          xl: "45px",
          lg: "50px",
          xl: "50px",
          "2xl": "50px",
        }}
      >
        <Heading 
          fontWeight={"100"}
          fontFamily={"'Space Grotesk', sans-serif"}
          fontSize={"30px"}
        >
          Menu that always make you fall in love
        </Heading>
      </Box>

  <Box
   w="100%"
    display={{base:"block",sm:"block",md:"none",lg:"none",xl:"none","2xl":"none"}} 
     m = "auto" border={"1px  red"} 
     p="30px"
     
    //  borderRadius={"20px"}
    //  shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
      >
            <Stack>
              <Button w="100%"  colorScheme={"blue"} fontWeight={"500"} fontSize={"25px"} onClick={handleMainV} >Main Course Veg</Button>
              <Button w="100%" colorScheme={"blue"}  fontWeight={"500"} fontSize={"25px"} onClick={handleRot} >Roti</Button>
            </Stack>
  </Box>


      <Box>
        {/* Menu item listed MainCourseVeg Start here */}
        <Box p="10px" ref={mainveg}>
          <SindleItem data={food?.maincoursev} heading={"Main Course Veg"} handleCart={handleCart} />
        </Box>

        {/* Menu item listed Roti start here */}
        <Box p="10px" ref={rot}>
          <SindleItem data={food?.roti} heading={"Roti"} handleCart={handleCart} />
        </Box>
      </Box>
    </Box>
  );
});

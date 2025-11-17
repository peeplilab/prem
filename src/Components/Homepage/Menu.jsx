import { Box, Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Redux/action";
import { SindleItem } from "./SindleItem";

function formatTitle(key) {
  return key
    .replace(/_/g, " ")
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const Menu = React.memo(({ setCart }) => {
  let cartData = JSON.parse(localStorage.getItem("cxcart")) || [];

  const handleCart = (item, isRemoving = false) => {
    if (isRemoving) {
      cartData = cartData.filter(cartItem => cartItem.name !== item.name);
    } else {
      item.count = 1;
      cartData.push(item);
    }

    localStorage.setItem("cxcart", JSON.stringify(cartData));
    setCart(JSON.parse(localStorage.getItem("cxcart")));
    try {
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: JSON.parse(localStorage.getItem("cxcart")) }));
    } catch (e) {}
  };

  const dispatch = useDispatch();
  const food = useSelector((store) => store.foodData || {});

  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  // refs for each section
  const sectionRefs = useRef({});

  const categories = Object.keys(food || {});

  // ensure refs exist
  categories.forEach((cat) => {
    if (!sectionRefs.current[cat]) sectionRefs.current[cat] = React.createRef();
  });

  const scrollTo = (cat) => {
    sectionRefs.current[cat]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box>
      <Box
        padding={{ base: "35px", sm: "35px", md: "40px", xl: "45px", lg: "50px", xl: "50px", "2xl": "50px" }}
      >
        <Heading fontWeight={"100"} fontFamily={"'Space Grotesk', sans-serif"} fontSize={"30px"}>
          Menu that always make you fall in love
        </Heading>
      </Box>

      <Box display={{ base: "none", md: "block" }} p="10px">
        <HStack alignItems="flex-start" spacing={6}>
          <Box w={{ base: "100%", md: "220px" }}>
            <Stack>
              {categories.map((cat) => (
                <Button key={cat} w="100%" colorScheme="blue" fontWeight="500" fontSize="18px" onClick={() => scrollTo(cat)}>
                  {formatTitle(cat)}
                </Button>
              ))}
            </Stack>
          </Box>

          <Box flex="1">
            {categories.map((cat) => (
              <Box key={cat} p="10px" ref={sectionRefs.current[cat]}>
                <SindleItem data={food?.[cat]} heading={formatTitle(cat)} handleCart={handleCart} />
              </Box>
            ))}
          </Box>
        </HStack>
      </Box>

      {/* Mobile: stacked sections without left nav */}
      <Box display={{ base: "block", md: "none" }} p="10px">
        {categories.map((cat) => (
          <Box key={cat} p="10px" ref={sectionRefs.current[cat]}>
            <SindleItem data={food?.[cat]} heading={formatTitle(cat)} handleCart={handleCart} />
          </Box>
        ))}
      </Box>
    </Box>
  );
});

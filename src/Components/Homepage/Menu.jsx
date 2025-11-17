import { Box, Button, Heading, HStack, Stack, Text, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton, useDisclosure } from "@chakra-ui/react";
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

  const scrollTo = (cat, closeDrawer) => {
    const node = sectionRefs.current[cat]?.current;
    if (!node) return;

    // measure navbar height (if present) so the sticky navbar doesn't cover the heading
    let navbarHeight = 0;
    try {
      const nav = document.querySelector('[data-navbar]');
      if (nav && nav.offsetHeight) navbarHeight = nav.offsetHeight;
    } catch (e) {}

    const rect = node.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const target = Math.max(absoluteTop - navbarHeight - 8, 0);
    window.scrollTo({ top: target, behavior: 'smooth' });
    if (typeof closeDrawer === 'function') closeDrawer();
  };

  return (
    <Box>

      {/* Desktop: show sections full-width, left nav removed. */}
      <Box p="10px">
        {categories.map((cat) => (
          <Box key={cat} p="10px" ref={sectionRefs.current[cat]}>
            <SindleItem data={food?.[cat]} heading={formatTitle(cat)} handleCart={handleCart} />
          </Box>
        ))}
      </Box>

      {/* Floating menu button + Drawer */}
      <FloatingCategoryDrawer categories={categories} scrollTo={scrollTo} />
    </Box>
  );
});

function FloatingCategoryDrawer({ categories, scrollTo }){
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        leftIcon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        aria-label="Open categories"
        position="fixed"
        right={{ base: 4, md: 8 }}
        bottom={{ base: 4, md: 8 }}
        zIndex={99999}
        colorScheme="blue"
        onClick={onOpen}
        borderRadius="full"
        px={4}
      >
        Menu
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Categories</DrawerHeader>
          <DrawerBody>
            <Stack spacing={3}>
              {categories.map((cat) => (
                <Button key={cat} w="100%" onClick={() => scrollTo(cat, onClose)}>
                  {formatTitle(cat)}
                </Button>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

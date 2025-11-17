import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Select, Heading, Stack, Text, Image, Flex } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { getData } from '../Redux/action';

export const Admin = () => {
  const dispatch = useDispatch();
  const food = useSelector((s) => s.foodData || {});
  const [menu, setMenu] = useState({});
  const [form, setForm] = useState({ category: '', img: '', name: '', qty: '', price: '' });
  const [edit, setEdit] = useState(null); // {cat, idx}

  useEffect(() => {
    if (food && Object.keys(food).length) {
      setMenu(food);
      // set default category if not set
      const keys = Object.keys(food);
      if (!form.category && keys.length) setForm((f) => ({ ...f, category: keys[0] }));
    } else dispatch(getData());
  }, [food, dispatch]);

  const saveMenu = (newMenu) => {
    try {
      localStorage.setItem('menuData', JSON.stringify(newMenu));
    } catch (e) {
      console.error('Failed to save menu to localStorage', e);
    }
    dispatch(getData());
    setMenu(newMenu);
  };

  const handleAdd = () => {
    const cat = form.category;
    const copy = JSON.parse(JSON.stringify(menu || {}));
    if (!copy[cat]) copy[cat] = [];
    copy[cat].push({ img: form.img, name: form.name, qty: form.qty, price: form.price, count: 0 });
    saveMenu(copy);
    setForm({ ...form, name: '', price: '', qty: '', img: '' });
  };

  const handleDelete = (cat, idx) => {
    if (!window.confirm('Delete this item?')) return;
    const copy = JSON.parse(JSON.stringify(menu || {}));
    copy[cat].splice(idx, 1);
    saveMenu(copy);
  };

  const startEdit = (cat, idx) => {
    const item = menu?.[cat]?.[idx];
    if (!item) return;
    setEdit({ cat, idx });
    setForm({ category: cat, img: item.img || '', name: item.name || '', qty: item.qty || '', price: item.price || '' });
  };

  const handleSaveEdit = () => {
    if (!edit) return;
    const copy = JSON.parse(JSON.stringify(menu || {}));
    copy[edit.cat][edit.idx] = { ...copy[edit.cat][edit.idx], img: form.img, name: form.name, qty: form.qty, price: form.price };
    saveMenu(copy);
    setEdit(null);
    const keys = Object.keys(copy || {});
    setForm({ category: keys[0] || '', img: '', name: '', qty: '', price: '' });
  };

  return (
    <Box p="20px">
      <Heading mb="16px">Admin — Manage Menu</Heading>

      <Box borderWidth="1px" p="12px" borderRadius="8px">
        <Heading size="sm" mb="8px">Add / Edit Item</Heading>
        <Stack direction={["column", "row"]} spacing={3} mb="8px">
          <Select w="200px" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {Object.keys(menu || {}).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </Select>
          <Input placeholder="Image URL" value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} />
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Qty" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
          <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          {edit ? (
            <Button colorScheme="green" onClick={handleSaveEdit}>Save Edit</Button>
          ) : (
            <Button colorScheme="blue" onClick={handleAdd}>Add Item</Button>
          )}
          {edit && <Button onClick={() => { setEdit(null); const keys = Object.keys(menu||{}); setForm({ category: keys[0]||'', img: '', name: '', qty: '', price: '' }); }}>Cancel</Button>}
        </Stack>
      </Box>

      <Box mt="20px">
        <Heading size="md" mb="8px">Menu Preview</Heading>
        <Stack spacing={6}>
          {Object.keys(menu || {}).length === 0 && <Text>No menu loaded yet.</Text>}
          {Object.entries(menu || {}).map(([cat, items]) => (
            <Box key={cat} borderWidth="1px" p="12px" borderRadius="6px">
              <Heading size="sm" mb="8px">{cat} ({items.length})</Heading>
              <Stack>
                {items.map((it, idx) => (
                  <Flex key={idx} align="center" justify="space-between">
                    <Flex align="center">
                      {it.img ? <Image src={it.img} alt={it.name} boxSize="60px" objectFit="cover" mr="8px" /> : null}
                      <Box>
                        <Text fontWeight="600">{it.name}</Text>
                        <Text fontSize="13px">{it.qty} • Rs {it.price}</Text>
                      </Box>
                    </Flex>
                    <Box>
                      <Button size="sm" mr="2" onClick={() => startEdit(cat, idx)}>Edit</Button>
                      <Button size="sm" colorScheme="red" onClick={() => handleDelete(cat, idx)}>Delete</Button>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

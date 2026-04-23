import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = 'http://localhost:5000/items';

// 🔹 GET items
export const fetchItems = createAsyncThunk('items/fetch', async () => {
  const res = await fetch(API);
  return res.json();
});

// 🔹 ADD item
export const addItem = createAsyncThunk('items/add', async (data) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
});

// 🔹 DELETE item
export const deleteItem = createAsyncThunk('items/delete', async (id) => {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  return id;
});

const itemSlice = createSlice({
  name: 'items',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchItems.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item._id !== action.payload);
      });
  }
});

export default itemSlice.reducer;
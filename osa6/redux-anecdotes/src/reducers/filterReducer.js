import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const filterSlice = createSlice({
  name: 'filters',
  initialState,

  // How to update
  reducers: {
    // When writing to filter box
    filterChange: (state, action) => action.payload,
  },
});

export const { filterChange } = filterSlice.actions;
export default filterSlice.reducer;

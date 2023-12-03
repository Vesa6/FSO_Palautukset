import { createSlice } from '@reduxjs/toolkit';

const initialState = 'Test initial state';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,

  // How to update
  reducers: {
    newNotificationAction: (state, action) => action.payload,
    removeNotificationAction: (state, action) => '',
  },
});

// This gives both functionalities their own action creator that can be called elsewhere
export const { newNotificationAction, removeNotificationAction } = notificationSlice.actions;
export default notificationSlice.reducer;

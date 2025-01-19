// src/features/sidebar/sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the sidebar
const initialState = {
  isVisible: true, // Sidebar is visible by default
};

// Create the slice with reducers and actions
const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    // Action to toggle the visibility of the sidebar
    toggleSidebar: (state) => {
      state.isVisible = !state.isVisible; // Toggle visibility on each call
    },
  },
});

// Export the action to be dispatched in components
export const { toggleSidebar } = sidebarSlice.actions;

// Export the reducer to be added to the Redux store
export default sidebarSlice.reducer;

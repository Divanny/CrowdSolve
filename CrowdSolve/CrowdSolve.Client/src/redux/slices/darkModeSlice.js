import { createSlice } from '@reduxjs/toolkit';

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: {
        isDarkMode: true,
    },
    reducers: {
        setDarkMode: (state, action) => {
            state.isDarkMode = action.payload;
        },
    },
});

export const { setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
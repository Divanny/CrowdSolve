import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Información del usuario
  token: null, // Token de autenticación
  views: [], // Vistas o permisos del usuario
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.views = Array.isArray(action.payload.views) ? action.payload.views : [];
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.views = [];
    },
    updateViews(state, action) {
        state.views = Array.isArray(action.payload.views) ? action.payload.views : state.views;
    },
  },
});

export const { setUser, clearUser, updateViews } = userSlice.actions;

export default userSlice.reducer;
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loadingReducer from './slices/loadingSlice';
import userReducer from './slices/userSlice';
import darkModeReducer from './slices/darkModeSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  loading: loadingReducer,
  user: userReducer,
  darkMode: darkModeReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'darkMode'], // Solo persistimos el estado del usuario
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loadingReducer from './slices/loadingSlice';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';
import languageReducer from './slices/languageSlice';
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
  theme: themeReducer,
  language: languageReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'theme', 'language'],
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

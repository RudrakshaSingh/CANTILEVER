import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import userSliceReducer from "./Slices/UserSlice";
import activitySliceReducer from "./Slices/ActivitySlice";

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['nearbyUsers'], // Exclude nearbyUsers from persistence
};

const persistedUserReducer = persistReducer(persistConfig, userSliceReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    activity: activitySliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: true,
});

// Create persistor
export const persistor = persistStore(store);
export default store;
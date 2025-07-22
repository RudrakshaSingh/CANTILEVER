import { configureStore } from "@reduxjs/toolkit";

import userSliceReducer from "./Slices/UserSlice";

const store = configureStore({
    reducer: {
        user: userSliceReducer,
    },
    devTools: true,
});

export default store;   
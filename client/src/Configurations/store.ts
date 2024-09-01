import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./main.ts";
import adminSlice from "./admin.ts";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    user: userSlice,
    admin: adminSlice,
});

const persistConfig = {
    key: "root",
    storage,
    version: 1,
    // whitelist: ['user', 'admin'] // Optionally, you can whitelist specific reducers if you want to persist only certain parts.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const myStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(myStore);

export default myStore;

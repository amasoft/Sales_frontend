import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/api/baseApi";
import authReducer from "@/features/auth/authSlice";
import uiReducer from "@/features/ui/uiSlice";
import settingsReducer from "@/features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    settings: settingsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

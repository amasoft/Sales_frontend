import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BusinessProfile } from "@/types";
import { DEFAULT_BUSINESS_PROFILE } from "@/lib/constants";

const STORAGE_KEY = "chingi_pos_business_profile";

function readStoredProfile(): BusinessProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_BUSINESS_PROFILE, ...JSON.parse(raw) } : DEFAULT_BUSINESS_PROFILE;
  } catch {
    return DEFAULT_BUSINESS_PROFILE;
  }
}

interface SettingsState {
  business: BusinessProfile;
}

const initialState: SettingsState = {
  business: readStoredProfile(),
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    businessProfileUpdated(state, action: PayloadAction<BusinessProfile>) {
      state.business = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
  },
});

export const { businessProfileUpdated } = settingsSlice.actions;
export default settingsSlice.reducer;

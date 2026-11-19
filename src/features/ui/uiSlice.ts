import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("chingi_pos_theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface UiState {
  theme: Theme;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  pageTitle: string;
}

const initialState: UiState = {
  theme: getInitialTheme(),
  sidebarCollapsed: false,
  mobileNavOpen: false,
  pageTitle: "Dashboard",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    themeToggled(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("chingi_pos_theme", state.theme);
    },
    sidebarToggled(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    mobileNavSet(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    pageTitleSet(state, action: PayloadAction<string>) {
      state.pageTitle = action.payload;
    },
  },
});

export const { themeToggled, sidebarToggled, mobileNavSet, pageTitleSet } = uiSlice.actions;
export default uiSlice.reducer;

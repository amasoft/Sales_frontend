import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types";

const TOKEN_KEY = "chingi_pos_token";
const USER_KEY = "chingi_pos_user";

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: readStoredUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Previous (broken) implementation — the payload never actually had a
    // `token` or `accessToken` field at this level (backend nests them under
    // `user.accessToken`/`user.refreshToken`), so a real captured JWT got
    // hardcoded here as a workaround and left in, and the localStorage write
    // read a field (`accessToken`) that didn't exist on the payload at all —
    // both of these masked the real bug instead of fixing it.
    // credentialsSet(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
    //   console.log(`state:${JSON.stringify(state)}`)
    //   console.log(`action:${JSON.stringify(action)}`)
    //   state.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6IlNBTEVTX0dJUkwiLCJuYW1lIjoidXNlcjUiLCJpYXQiOjE3ODMzNzYxNTAsImV4cCI6MTc4MzM3NzA1MH0.a4cQgYt-oN3oDkitYRMK0VP4UioIATpNNU-ImCdmNwU";
    //   // state.token = action.payload.user.accessToken;
    //   state.user = action.payload.user;
    //   localStorage.setItem(TOKEN_KEY, action.payload.accessToken);
    //   localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    // },
    credentialsSet(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string; user: AuthUser }>
    ) {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem(TOKEN_KEY, action.payload.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    loggedOut(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { credentialsSet, loggedOut } = authSlice.actions;
export default authSlice.reducer;

export function selectIsAuthenticated(state: { auth: AuthState }) {
  return Boolean(state.auth.token);
}
export function selectCurrentUser(state: { auth: AuthState }) {
  return state.auth.user;
}

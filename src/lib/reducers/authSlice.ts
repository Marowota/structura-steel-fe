import { TJwtObject } from "@/types/TJwtObject";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TAuthToken } from "@/types/TAuthToken";

export interface IAuthState {
  isAuthenticated: boolean;
  isTokenExpired: boolean;
  userInfo: TJwtObject | null;
  authToken: TAuthToken | null;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  isTokenExpired: true,
  userInfo: null,
  authToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = true;
      state.isTokenExpired = false;
      state.userInfo = action.payload.userInfo;
      state.authToken = action.payload.authToken;
    },
    expireToken: (state) => {
      state.isTokenExpired = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.authToken = null;
    },
  },
});

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectUserInfo = (state: RootState) => state.auth.userInfo;

export const selectAuthToken = (state: RootState) => state.auth.authToken;

export const selectAuthObject = (state: RootState) => state.auth;

export const selectIsTokenExpired = (state: RootState) =>
  state.auth.isTokenExpired;

export const { authenticate, expireToken, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

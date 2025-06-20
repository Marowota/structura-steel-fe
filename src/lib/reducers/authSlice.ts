import { TJwtObject } from "@/types/TJwtObject";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TAuthToken } from "@/types/TAuthToken";

export interface IAuthState {
  isAuthenticated: boolean;
  isTokenExpired: boolean;
  userInfo: TJwtObject | null;
  authToken: TAuthToken | null;
  firstLogin: boolean;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  isTokenExpired: true,
  userInfo: null,
  authToken: null,
  firstLogin: false,
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
      state.firstLogin = false;
    },
    expireToken: (state) => {
      state.isTokenExpired = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.authToken = null;
      state.firstLogin = false;
    },
    setFirstLogin: (state, action) => {
      console.log("setFirstLogin", action.payload);
      state.firstLogin = action.payload.firstLogin ?? true;
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

export const selectIsFirstLogin = (state: RootState) => state.auth.firstLogin;

export const { authenticate, expireToken, logout, setFirstLogin } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
